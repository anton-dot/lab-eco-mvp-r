const ethUtil = require('ethereumjs-util');
const config = require('../config');

const LOGIN_MESSAGE = 'Login Quant Fund';

const verifyWalletAddress = async (publicAddress, signature, message = LOGIN_MESSAGE) => {
  try {
    const msgBuffer = Buffer.from(message, 'utf8');
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    const publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const address = ethUtil.bufferToHex(addressBuffer);
    return address.toLowerCase() === publicAddress.toLowerCase();
  } catch (error) {
    return false;
  }
};

const isAddressBlocked = (address) => {
  return config.blockedAddresses.includes(address.toLowerCase());
};

module.exports = {
  verifyWalletAddress,
  isAddressBlocked,
  LOGIN_MESSAGE,
};

