const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const User = require('../models/User');

// Generate QR code for a user
router.get('/generate/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate QR code URL pointing to user profile page
    const profileUrl = `${process.env.WEB_URL || 'http://localhost:3000'}/profile/${user.qrCodeId}`;
    
    // Generate QR code as Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
    });
    
    res.json({
      qrCode: qrCodeDataUrl,
      qrCodeId: user.qrCodeId,
      profileUrl: profileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
});

// Generate QR code by QR Code ID
router.get('/generate-by-qrid/:qrCodeId', async (req, res) => {
  try {
    const user = await User.findOne({ qrCodeId: req.params.qrCodeId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const profileUrl = `${process.env.WEB_URL || 'http://localhost:3000'}/profile/${user.qrCodeId}`;
    
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
    });
    
    res.json({
      qrCode: qrCodeDataUrl,
      qrCodeId: user.qrCodeId,
      profileUrl: profileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
});

module.exports = router;
