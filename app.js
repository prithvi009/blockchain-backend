const express = require('express');
const { ethers } = require('ethers');
const { escrowMarketplaceContract } = require('./ether.js'); // Updated contract import
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// 1. Get Contract Info
app.get('/marketplace', async (req, res) => {
  try {
    const escrowCount = await escrowMarketplaceContract.escrowCount();
    res.json({ escrowCount: escrowCount.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Create New Escrow
app.post('/escrow', async (req, res) => {
  try {
    const { sellerAddress, amount } = req.body;
    
    const tx = await escrowMarketplaceContract.createEscrow(sellerAddress, {
      value: ethers.parseEther(amount.toString())
    });
    const receipt = await tx.wait();
    
    // Get escrow ID from event logs
    const escrowId = (await escrowMarketplaceContract.escrowCount()).toString();
    
    res.json({ 
      success: true,
      escrowId,
      txHash: tx.hash
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Escrow Details
app.get('/escrow/:id', async (req, res) => {
  try {
    const escrow = await escrowMarketplaceContract.getEscrow(req.params.id);
    res.json({
      buyer: escrow.buyer,
      seller: escrow.seller,
      amount: escrow.amount.toString(),
      status: getStatusName(escrow.status)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Release Funds (Buyer)
app.post('/escrow/:id/release', async (req, res) => {
  try {
    const tx = await escrowMarketplaceContract.releaseFunds(req.params.id);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Refund Buyer (Seller)
app.post('/escrow/:id/refund', async (req, res) => {
  try {
    const tx = await escrowMarketplaceContract.refundBuyer(req.params.id);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function
function getStatusName(status) {
  return ["AWAITING_PAYMENT", "FUNDED", "RELEASED", "REFUNDED"][status];
}

const PORT = 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));