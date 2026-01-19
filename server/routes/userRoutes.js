const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users (with optional role filter)
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// GET user by QR Code ID
router.get('/qr/:qrCodeId', async (req, res) => {
  try {
    const user = await User.findOne({ qrCodeId: req.params.qrCodeId }).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// GET QR code URL for a user (for Flutter app to generate QR codes)
router.get('/:id/qr-url', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('_id fullName role qrCodeId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.qrCodeId) {
      return res.status(404).json({ message: 'User does not have a QR code yet. Run the generateQRCodes script.' });
    }
    
    // Return the web URL that Flutter app should encode in the QR code
    const qrUrl = `${process.env.WEB_URL || 'http://localhost:3000'}/profile/${user.qrCodeId}`;
    
    res.json({
      userId: user._id,
      fullName: user.fullName,
      role: user.role,
      qrCodeId: user.qrCodeId,
      qrUrl: qrUrl,
      message: 'Encode this qrUrl in the QR code for the user'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching QR URL', error: error.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;
