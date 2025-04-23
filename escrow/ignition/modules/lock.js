const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EscrowMarketplace", (m) => {
  // Deploy the main marketplace contract
  const escrowMarketplace = m.contract("EscrowMarketplace");

  // Optional: Create a sample escrow (uncomment if needed)
  /*
  const sellerAddress = m.getParameter(
    "sellerAddress",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  );
  const depositAmount = m.getParameter("depositAmount", ethers.parseEther("1"));
  
  m.call(escrowMarketplace, "createEscrow", [sellerAddress], {
    value: depositAmount
  });
  */

  return { escrowMarketplace };
});