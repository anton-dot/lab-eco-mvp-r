const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ethUtil = require('ethereumjs-util');
const config = require('../config');
const UserModel = require('../models/user.model');
const { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } = require('../utils/response');
const logger = require('../utils/logger');

const LOGIN_MESSAGE = 'Login Quant Fund';
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEYLEN = 64;

const normalizedEmail = (email = '') => email.trim().toLowerCase();

const passHash = (password) => {
  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString('hex');
  const hash = crypto.scryptSync(password, salt, PASSWORD_KEYLEN).toString('hex');
  return `${salt}:${hash}`;
};

const checkPass = (password, storedHash) => {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }

  const [salt, hash] = storedHash.split(':');
  const derived = crypto.scryptSync(password, salt, PASSWORD_KEYLEN);
  const stored = Buffer.from(hash, 'hex');

  if (stored.length !== derived.length) {
    return false;
  }

  return crypto.timingSafeEqual(stored, derived);
};

const authData = (user) => {
  const tokenPayload = {
    id: user.id,
    email: user.email || undefined,
    address: user.address || undefined,
  };

  const accessToken = jwt.sign(tokenPayload, config.JWT_SECRET_KEY, {
    expiresIn: config.SESSION_EXPIRES_IN,
  });

  return {
    id: user.id,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    email: user.email || '',
    address: user.address || null,
    referral_code: user.referral_code,
    is_admin: user.is_admin,
    access_token: accessToken,
    authToken: accessToken,
  };
};

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
    logger.error('Wallet verification error:', error);
    return false;
  }
};

exports.loginWithSignature = async (req, res, next) => {
  try {
    const { address, signature, referral_address } = req.body;

    if (!address || !signature) {
      const { response, statusCode } = validationErrorResponse('Address and signature are required');
      return res.status(statusCode).json(response);
    }

    // Check if address is blocked
    if (config.blockedAddresses.includes(address.toLowerCase())) {
      const { response, statusCode } = errorResponse('This address is blocked', 403);
      return res.status(statusCode).json(response);
    }

    const isValid = await verifyWalletAddress(address, signature);
    if (!isValid) {
      const { response, statusCode } = errorResponse('Wallet signature verification failed', 401);
      return res.status(statusCode).json(response);
    }

    let users = await UserModel.getUsersDetailsAddress({ address });

    if (users.length === 0) {
      let referralId = null;
      if (referral_address) {
        const refUsers = await UserModel.getUserDetailsByAddress(referral_address);
        if (refUsers.length === 0) {
          const { response, statusCode } = validationErrorResponse('Invalid referral code');
          return res.status(statusCode).json(response);
        }
        referralId = refUsers[0].id;
      }

      const referralCode = 'REF' + Math.random().toString(36).substr(2, 5).toUpperCase();
      const saved = await UserModel.saveUserAddressDetails({
        address,
        referral_id: referralId,
        referral_code: referralCode
      });
      users = [{ id: saved.insertId, address, referral_code: referralCode, is_admin: 0 }];
    }

    const user = users[0];
    const { response, statusCode } = successResponse(authData(user), 'Login successful');

    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      firstName = '',
      lastName = '',
      email = '',
      password = '',
    } = req.body;

    const userEmail = normalizedEmail(email);

    if (!firstName.trim() || !lastName.trim() || !userEmail || !password) {
      const { response, statusCode } = validationErrorResponse('First name, last name, email, and password are required');
      return res.status(statusCode).json(response);
    }

    if (password.length < 8) {
      const { response, statusCode } = validationErrorResponse('Password must be at least 8 characters long');
      return res.status(statusCode).json(response);
    }

    const existingUsers = await UserModel.getUserByEmail(userEmail);
    if (existingUsers.length > 0) {
      const { response, statusCode } = validationErrorResponse('Email is already registered');
      return res.status(statusCode).json(response);
    }

    const referralCode = 'REF' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const saved = await UserModel.saveUserEmailDetails({
      email: userEmail,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      password_hash: passHash(password),
      referral_code: referralCode,
    });

    const user = {
      id: saved.insertId,
      email: userEmail,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      address: null,
      referral_code: referralCode,
      is_admin: 0,
    };

    const { response, statusCode } = successResponse(authData(user), 'Registration successful');
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body;
    const userEmail = normalizedEmail(email);

    if (!userEmail || !password) {
      const { response, statusCode } = validationErrorResponse('Email and password are required');
      return res.status(statusCode).json(response);
    }

    const users = await UserModel.getUserByEmail(userEmail);
    if (users.length === 0 || !checkPass(password, users[0].password_hash)) {
      const { response, statusCode } = unauthorizedResponse('Invalid email or password');
      return res.status(statusCode).json(response);
    }

    const { response, statusCode } = successResponse(authData(users[0]), 'Login successful');
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Email login error:', error);
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const { response, statusCode } = successResponse({
      id: req.user_id,
      email: req.email,
      address: req.address,
    });
    return res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (_req, res) => {
  const { response, statusCode } = errorResponse('Not implemented', 501);
  return res.status(statusCode).json(response);
};

exports.logout = async (_req, res) => {
  const { response, statusCode } = successResponse(null, 'Logout successful');
  return res.status(statusCode).json(response);
};
