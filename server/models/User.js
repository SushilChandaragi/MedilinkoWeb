const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'doctor', 'pharmacist'],
  },
  isProfileComplete: Boolean,
  fcmToken: String,
  fcmTokens: [mongoose.Schema.Types.Mixed],
  
  // Location
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  
  // Doctor specific
  clinicLatitude: Number,
  clinicLongitude: Number,
  
  // Pharmacist specific
  pharmacyLatitude: Number,
  pharmacyLongitude: Number,
  medicines: [mongoose.Schema.Types.Mixed],
  
  // QR Code ID (will be generated for web)
  qrCodeId: {
    type: String,
    sparse: true,
    index: true,
  },
  
  createdAt: Date,
  updatedAt: Date,
}, { strict: false });

module.exports = mongoose.model('User', userSchema, 'users');
