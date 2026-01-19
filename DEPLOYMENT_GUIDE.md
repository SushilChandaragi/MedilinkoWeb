# 🚀 EmergencyMed Production Deployment Guide

## Overview
This guide covers deploying the EmergencyMed web interface to work with your existing MediLinko Flutter app and backend.

---

## 📋 Prerequisites

- [ ] GitHub account with MedilinkoWeb repository
- [ ] Render account (or other hosting platform)
- [ ] Access to MediLinko backend on Render
- [ ] MongoDB Atlas database (already configured)

---

## 🎯 Architecture Overview

```
┌─────────────────┐
│  Flutter App    │ ──────┐
│   (Mobile)      │       │
└─────────────────┘       │
                          │
┌─────────────────┐       │      ┌──────────────────┐
│  Web Browser    │ ──────┼─────>│  EmergencyMed    │
│  (QR Scanner)   │       │      │   Web Frontend   │
└─────────────────┘       │      │  (React - Render)│
                          │      └──────────────────┘
                          │              │
                          │              │ API Calls
                          ▼              ▼
                   ┌──────────────────────────┐
                   │   MediLinko Backend      │
                   │   (Express - Render)     │
                   └──────────────────────────┘
                              │
                              │
                              ▼
                   ┌──────────────────────────┐
                   │   MongoDB Atlas          │
                   │   (Shared Database)      │
                   └──────────────────────────┘
```

---

## 🔧 Step 1: Deploy Backend to Render

### A. Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `SushilChandaragi/MedilinkoWeb`

### B. Configure Build Settings

```yaml
Name: medilinko-emergency-backend
Environment: Node
Region: Singapore (or closest to your users)
Branch: main
Root Directory: (leave empty)
Build Command: npm install
Start Command: node server/index.js
```

### C. Environment Variables

Add these in Render's Environment section:

| Key | Value | Example |
|-----|-------|---------|
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster0.tkfu1ug.mongodb.net/medilinko` |
| `PORT` | `10000` | Render auto-assigns this |
| `NODE_ENV` | `production` | - |
| `WEB_URL` | *Will add after frontend deployment* | `https://medilinko-emergency.onrender.com` |
| `MEDILINKO_BACKEND_URL` | Your existing backend URL | `https://medilinko-backend.onrender.com` |
| `JWT_SECRET` | Random secure string | Use a password generator |

### D. Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (~2-3 minutes)
3. **Copy the backend URL** (e.g., `https://medilinko-emergency-backend.onrender.com`)

---

## 🌐 Step 2: Deploy Frontend to Render

### A. Create Static Site on Render

1. Click **"New +"** → **"Static Site"**
2. Select the same repository: `SushilChandaragi/MedilinkoWeb`

### B. Configure Build Settings

```yaml
Name: medilinko-emergency-frontend
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: build
```

### C. Environment Variables

Add this in Render's Environment section:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | Your backend URL from Step 1 |

Example:
```
REACT_APP_API_URL=https://medilinko-emergency-backend.onrender.com
```

### D. Update React App

Before deploying, update the API URL in your React code:

**File: `client/src/pages/UserProfile.js`**
```javascript
// Add at the top of the file
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Then in useEffect:
axios.get(`${API_URL}/api/users/qr/${qrCodeId}`)
```

**File: `client/src/pages/UserList.js`**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Update all API calls to use API_URL
axios.get(`${API_URL}/api/users${roleParam}`)
```

### E. Deploy

1. Click **"Create Static Site"**
2. Wait for deployment
3. **Copy the frontend URL** (e.g., `https://medilinko-emergency.onrender.com`)

---

## 🔄 Step 3: Update Environment Variables

Now that you have both URLs, go back and update:

### A. Update Backend WEB_URL

1. Go to your backend service on Render
2. Navigate to **Environment**
3. Update `WEB_URL` to your frontend URL
4. Click **"Save Changes"** (auto-redeploys)

### B. Update MediLinko Backend

1. Go to your **existing MediLinko backend** service on Render
2. Navigate to **Environment**
3. Add new variable:
   ```
   EMERGENCY_WEB_URL=https://medilinko-emergency.onrender.com
   ```
4. Click **"Save Changes"**

---

## 📱 Step 4: Update Flutter App

### A. Update Emergency Web Service

**File: `lib/services/emergency_web_service.dart`**

```dart
class EmergencyWebService {
  // Update this URL with your deployed backend
  static const String _baseUrl = kDebugMode
      ? 'http://10.0.2.2:5000'  // Android emulator
      : 'https://medilinko-emergency-backend.onrender.com';  // 👈 UPDATE THIS
  
  static const String _webBaseUrl = kDebugMode
      ? 'http://localhost:3000'
      : 'https://medilinko-emergency.onrender.com';  // 👈 UPDATE THIS
```

### B. Rebuild Flutter App

```bash
# For Android
flutter build apk --release

# For iOS
flutter build ios --release

# For testing
flutter run --release
```

---

## ✅ Step 5: Verification Checklist

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "MediLinko Web API is running"
}
```

### Test User API
```bash
curl https://your-backend-url.onrender.com/api/users
```

Should return array of users.

### Test QR URL Endpoint
```bash
curl https://your-backend-url.onrender.com/api/users/{userId}/qr-url
```

Should return QR URL for that user.

### Frontend Access
1. Open browser: `https://your-frontend-url.onrender.com`
2. Click "View All Users"
3. Should see all 44 users from database
4. Click on a user → Should see QR code

### Flutter Integration
1. Open Flutter app
2. Navigate to user profile
3. Tap "Generate QR" or "View QR"
4. QR code should display
5. Scan with phone camera
6. Should redirect to web profile

---

## 🔒 Security Checklist

- [ ] MongoDB URI is in environment variables, not in code
- [ ] JWT_SECRET is randomly generated and secure
- [ ] CORS is configured to only allow your domains
- [ ] `.env` file is in `.gitignore`
- [ ] No sensitive data in GitHub repository

---

## 🐛 Troubleshooting

### Problem: "CORS Error" in browser console

**Solution:** Update backend CORS configuration
```javascript
// In server/index.js
const allowedOrigins = [
  'https://your-frontend-url.onrender.com',
  'http://localhost:3000'
];
```

### Problem: "Cannot connect to backend" in Flutter

**Solution:** 
1. Check if backend URL is correct in `emergency_web_service.dart`
2. Ensure backend is deployed and running
3. Test backend URL in browser first

### Problem: "User not found" when scanning QR

**Solution:**
1. Ensure `generateQRCodes.js` was run successfully
2. Check MongoDB to verify users have `qrCodeId` field
3. Verify QR URL format matches: `/profile/{qrCodeId}`

### Problem: Frontend shows blank page

**Solution:**
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` is set correctly
3. Check if backend is accessible
4. Check Render logs for build errors

---

## 📊 Monitoring

### Render Dashboard
- Monitor logs for errors
- Check deployment status
- View resource usage

### Key Metrics to Watch
- Response times
- Error rates
- Database connection status
- CORS errors in logs

---

## 🔄 Continuous Deployment

Once set up, Render will automatically:
1. Detect pushes to GitHub `main` branch
2. Rebuild and redeploy the application
3. Zero-downtime deployment

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

---

## 💰 Cost Estimation

### Render Free Tier
- ✅ Web Service (Backend): Free (spins down after inactivity)
- ✅ Static Site (Frontend): Free
- ⚠️ Both services will spin down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes ~30 seconds

### Render Paid Tier ($7/month per service)
- ✅ Always online (no spin-down)
- ✅ Faster performance
- ✅ Custom domains

### MongoDB Atlas
- ✅ Free tier: 512MB storage (sufficient for testing)
- Upgrade if you exceed limits

---

## 🎉 Success!

If all steps completed:
- ✅ Backend is live and accessible
- ✅ Frontend is deployed and loads
- ✅ Database connection works
- ✅ Flutter app can generate QR codes
- ✅ QR codes redirect to web profiles
- ✅ Anyone can scan QR codes without the app

---

## 📚 Next Steps

1. **Custom Domain (Optional)**
   - Buy a domain (e.g., medilinko.com)
   - Configure in Render settings
   - Update all URLs accordingly

2. **SSL Certificate**
   - Render provides free SSL automatically
   - Ensure all URLs use `https://`

3. **Analytics**
   - Add Google Analytics to track usage
   - Monitor QR scan rates

4. **Performance**
   - Enable caching
   - Optimize images
   - Consider CDN for static assets

---

## 📞 Support

If you encounter issues:
1. Check Render logs for errors
2. Review this guide's troubleshooting section
3. Verify all environment variables are set correctly
4. Test each component independently

---

**Last Updated:** January 20, 2026
**Version:** 1.0
