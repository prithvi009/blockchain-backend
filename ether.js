const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Updated ABI import path
const escrowMarketplaceABI = require('./escrow/artifacts/contracts/Lock.sol/EscrowMarketplace.json').abi;

const escrowMarketplaceContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  escrowMarketplaceABI,
  wallet
);

module.exports = { escrowMarketplaceContract, provider, wallet };