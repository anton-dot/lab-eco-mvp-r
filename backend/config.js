require('dotenv').config();

module.exports = { 
  // Database removed - using mock data service instead
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'change-this-secret-key-in-production',
  SESSION_EXPIRES_IN: process.env.SESSION_EXPIRES_IN || '24h',
  imageUrl: process.env.IMAGE_URL || '',
  contractAddress: process.env.CONTRACT_ADDRESS || '0x98Ff86eD5B0dDd3C85115845A90A6066C25bedf9',
  clientDepositAddress: process.env.CLIENT_DEPOSIT_ADDRESS || '0xEfcd2e9ca6483147A25a106C654a6E557eb8f916',
  port: parseInt(process.env.PORT || '1357', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  blockedAddresses: (process.env.BLOCKED_ADDRESSES || '0x91db0dbd7ee9ea405852f65f044739c90cd076d5').split(',').filter(Boolean),
};
