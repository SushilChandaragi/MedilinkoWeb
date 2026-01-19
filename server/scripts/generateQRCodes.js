require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function generateQRCodes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!\n');

    // Find all users without QR codes
    const usersWithoutQR = await User.find({ $or: [{ qrCodeId: { $exists: false } }, { qrCodeId: null }] });
    
    console.log(`Found ${usersWithoutQR.length} users without QR codes\n`);

    let updated = 0;
    for (const user of usersWithoutQR) {
      const qrCodeId = `ML-${user.role.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await User.updateOne(
        { _id: user._id },
        { $set: { qrCodeId: qrCodeId } }
      );
      
      console.log(`✅ Generated QR for: ${user.fullName} (${user.role}) → ${qrCodeId}`);
      updated++;
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log(`\n✅ Successfully generated ${updated} QR codes!`);
    
    // Display sample URLs
    console.log('\n📱 Sample QR Code URLs:');
    const sampleUsers = await User.find({ qrCodeId: { $exists: true } }).limit(3);
    sampleUsers.forEach(user => {
      console.log(`   ${user.fullName}: http://localhost:3000/profile/${user.qrCodeId}`);
    });

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

generateQRCodes();
