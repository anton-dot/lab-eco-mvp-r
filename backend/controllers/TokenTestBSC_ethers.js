var express = require("express");
var router = express.Router();
const { ethers } = require("ethers");
const ethUtil = require("ethereumjs-util");
const ethereum_address = require("ethereum-address");
const { response } = require("express");
var fetch = require('node-fetch');

const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");

var abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "listAddress", "type": "address" }, { "name": "isBlackListed", "type": "bool" }], "name": "blackListAddress", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_name", "type": "string" }, { "name": "_symbol", "type": "string" }, { "name": "_decimals", "type": "uint256" }, { "name": "_supply", "type": "uint256" }, { "name": "tokenOwner", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "blackListed", "type": "address" }, { "indexed": false, "name": "value", "type": "bool" }], "name": "Blacklist", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]

exports.addressCheck = async (request, response) => {
  let address = request.params.address;
  var status = ethers.utils.isAddress(address);

  return response.status(200).json({
    status: status
  });
}

exports.transfer = async (data) => {
  let fromAddress = data.from_address;
  let privateKey = data.from_private_key;
  let amount = data.amount;
  let contractAddress = data.contract_address;
  let to_address = data.to_address;

  var tokenValue = ethers.utils.parseEther(amount.toString());
  console.log('DATA', data)
  
  try {
    const bbal = await provider.getBalance(fromAddress);
    if (bbal == "0") {
      return "You have insufficient balance";
    }

    const contract = new ethers.Contract(contractAddress, abi, provider);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet);

    let decimals = await contract.decimals();
    let token = await contract.balanceOf(fromAddress);
    if (token / (10 ** decimals) < amount) {
      return "You have insufficient token balance";
    }

    const tx = await contractWithSigner.transfer(to_address, tokenValue, {
      gasLimit: 300000
    });

    console.log("Transaction hash:", tx.hash);
    return tx.hash;

  } catch (e) {
    console.log('e', e);
    return `Error: ${e.message}`;
  }
}

exports.getTokenBalance = async (request, response) => {
  let address = request.body.address;
  let contractAddress = request.body.contract_address;
  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    let decimals = await contract.decimals();
    let token = await contract.balanceOf(address);
    return response.status(200).json({
      balance: token / 10 ** decimals,
    });
  } catch (e) {
    return response.status(400).json({
      msg: "something went wrong",
      e: e,
    });
  }
}

exports.createWallet = async (request, response) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    console.log(wallet);

    return response.status(200).json({
      wallet: {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic
      }
    });
  } catch (e) {
    return response.status(400).json({
      msg: "something went wrong",
      e: e,
    });
  }
}

exports.getBalance = async (request, response) => {
  let address = request.params.address;
  try {
    const balance = await provider.getBalance(address);
    console.log(balance);

    return response.status(200).json({
      balance: ethers.utils.formatEther(balance),
      currency: 'BNB'
    });
  } catch (e) {
    return response.status(400).json({
      msg: "something went wrong",
      e: e,
    });
  }
}

exports.getTransactionByAddress = async (request, response) => {
  let fromAddress = request.body.from_address;
  let to_address = request.body.to_address;
  let amount = request.body.amount;
  console.log(request.body)
  try {
    var reqData = {"query":"query MyQuery {\n  ethereum(network: bsc_testnet) {\n    transactions(\n      options: {limit: 10, desc: \"block.timestamp.time\"}\n      amount: {is: "+amount+"}\n    ) {\n      success(success: true)\n      sender(txSender: {is: \""+fromAddress+"\"}) {\n        address\n      }\n      to(txTo: {is: \""+to_address+"\"}) {\n        address\n      }\n      amount\n      gasValue\n      gas\n      gasPrice\n      hash\n      block {\n        timestamp {\n          time\n        }\n      }\n      currency {\n        symbol\n      }\n    }\n  }\n}\n","variables":"{}"};
    var resData = await fetch("https://graphql.bitquery.io/", {
      method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        reqData
      )
    });
    const resData1 = await resData.json();
    
    var transactions = resData1.data.ethereum.transactions;
    return response.status(200).json({
      transactions
    });
  } catch (e) {
    return response.status(400).json({
      msg: "something went wrong",
      e: e,
    });
  }
}
