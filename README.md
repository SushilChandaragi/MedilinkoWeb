# 🏥 MediLinko Web - QR Code Healthcare System

A simple web interface for MediLinko that generates unique QR codes for each user profile. When scanned with any QR scanner (Google Lens, phone camera, etc.), the QR code redirects to a web page displaying the user's complete healthcare information.

## ✨ Features

- **🔍 Universal QR Scanner Compatible**: Works with Google Lens, phone cameras, and all standard QR scanning apps
- **📱 Unique QR Codes**: Each user gets a unique QR code that links to their profile
- **👤 Role-Based Profiles**: Support for Users/Patients, Doctors, and Pharmacists
- **💊 Medical Information**: Display allergies, medications, medical history, and emergency contacts
- **🎨 Clean UI**: Simple, responsive interface built with React
- **🔒 MongoDB Backend**: Secure data storage with MongoDB Atlas

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd emergencyMed
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   
   The `.env` file is already configured with your MongoDB connection:
   ```env
   MONGODB_URI=mongodb+srv://sushilchandaragi_db_user:Sushil1234@cluster0.tkfu1ug.mongodb.net/medilinko?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   WEB_URL=http://localhost:3000
   ```

4. **Start the application**
   
   **Option 1: Run both server and client together (recommended)**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📱 How It Works

### 1. Create a User Profile
- Go to http://localhost:3000/create-user
- Fill in user information (name, email, phone, medical info, etc.)
- Select role: User/Patient, Doctor, or Pharmacist
- Click "Create User"

### 2. Generate QR Code
- After creating a user, you'll be redirected to their profile
- Click "Show QR Code" button
- Download the QR code image

### 3. Scan & Access
- Use any QR scanner app (Google Lens, phone camera, etc.)
- Scan the QR code
- Instantly view the complete user profile with all medical information

## 🗂️ Project Structure

```
emergencyMed/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js              # Landing page
│   │   │   ├── UserProfile.js       # Profile display page
│   │   │   ├── UserList.js          # All users list with QR
│   │   │   └── CreateUser.js        # User creation form
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Express backend
│   ├── models/
│   │   └── User.js                  # MongoDB user schema
│   ├── routes/
│   │   ├── userRoutes.js            # User CRUD operations
│   │   └── qrRoutes.js              # QR code generation
│   └── index.js
├── .env                   # Environment configuration
└── package.json           # Root package file
```

## 🔌 API Endpoints

### Users
- `GET /api/users` - Get all users (optional: ?role=user/doctor/pharmacist)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/qr/:qrCodeId` - Get user by QR code ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### QR Code
- `GET /api/qr/generate/:userId` - Generate QR code for user
- `GET /api/qr/generate-by-qrid/:qrCodeId` - Generate QR by QR code ID

### Health Check
- `GET /api/health` - Server health status

## 📋 User Data Schema

### Common Fields (All Roles)
- Name, Email, Phone
- Date of Birth, Gender, Blood Group
- Address
- Emergency Contact (name, phone, relationship)
- QR Code ID (auto-generated unique identifier)

### User/Patient Specific
- Medical History (conditions, diagnosed dates, notes)
- Allergies
- Current Medications (name, dosage, frequency, start date)

### Doctor Specific
- Specialization
- Qualification
- Experience (years)
- Clinic Name & Address
- Consultation Fee

### Pharmacist Specific
- Pharmacy Name & Address
- License Number

## 🔒 QR Code Security

Each user gets a unique QR code ID in the format:
```
ML-{ROLE}-{TIMESTAMP}-{RANDOM}
```

Example: `ML-USER-1705747200000-a8f3d9e2`

The QR code encodes a URL like:
```
http://localhost:3000/profile/ML-USER-1705747200000-a8f3d9e2
```

## 🎯 Use Cases

1. **Emergency Situations**: 
   - Quick access to medical history and emergency contacts
   - First responders can scan QR on medical ID card

2. **Hospital Check-ins**:
   - Patients scan QR for instant registration
   - Doctors scan to view patient history

3. **Pharmacy Services**:
   - Scan QR to view current medications
   - Avoid medication conflicts

4. **Doctor Consultations**:
   - Share QR code to book appointments
   - View doctor credentials and fees

## 🔧 Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`
2. **Frontend**: Add pages in `client/src/pages/`
3. **Database**: Update schema in `server/models/User.js`

### Testing QR Codes

1. Create a user via the web interface
2. Generate and download QR code
3. Test with:
   - Google Lens (Android/iOS)
   - Phone camera app
   - Free QR scanner apps (QR Code Reader, etc.)
   - Online QR scanners

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the 'build' folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables in hosting platform
# Deploy from root directory
```

### Update Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
WEB_URL=https://yourdomain.com
NODE_ENV=production
```

## 🐛 Troubleshooting

### QR Code Not Working
- Ensure backend is running on port 5000
- Check that WEB_URL in .env matches your frontend URL
- Verify QR code image is generated correctly

### Database Connection Error
- Check MongoDB URI is correct
- Ensure MongoDB Atlas allows connections from your IP
- Verify network connectivity

### CORS Errors
- Backend has CORS enabled for all origins in development
- For production, update CORS settings in `server/index.js`

### Cannot Create User
- Check all required fields are filled (name, email, phone, role)
- Verify backend is connected to MongoDB
- Check browser console for errors

## 📱 Mobile Integration

To integrate with your existing Flutter app:

1. **Share Database**: Both web and mobile use the same MongoDB database
2. **QR Codes Work Everywhere**: QR codes generated in the app work on web and vice versa
3. **Consistent Schema**: The User model matches your Flutter app's data structure

## 🔄 Syncing with Flutter App

The web interface uses the same MongoDB database as your Flutter app, so:
- Users created in Flutter app appear on the web
- Users created on web appear in Flutter app
- QR codes are interchangeable between platforms

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check browser console for errors
- Verify MongoDB connection

## 📄 License

MIT License - feel free to use for your projects!

## 👥 Author

**Sushil SC**  
MediLinko Healthcare Management System

---

**Built with ❤️ using React, Node.js, Express, and MongoDB**
