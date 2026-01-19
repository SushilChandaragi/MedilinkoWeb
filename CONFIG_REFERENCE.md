# 🔧 Production Configuration Quick Reference

## 📌 All URLs You'll Need

### After Deployment, You'll Have:

| Service | Development | Production (Update These!) |
|---------|-------------|---------------------------|
| **EmergencyMed Backend** | `http://localhost:5000` | `https://medilinko-emergency-backend.onrender.com` |
| **EmergencyMed Frontend** | `http://localhost:3000` | `https://medilinko-emergency.onrender.com` |
| **MediLinko Backend** | `http://localhost:8080` | `https://medilinko-backend.onrender.com` *(already deployed)* |
| **MongoDB** | - | `mongodb+srv://...@cluster0.tkfu1ug.mongodb.net/medilinko` |

---

## 🔄 Configuration Changes Required

### 1️⃣ EmergencyMed Backend (Render Environment Variables)

```env
MONGODB_URI=mongodb+srv://sushilchandaragi_db_user:Sushil1234@cluster0.tkfu1ug.mongodb.net/medilinko
PORT=10000
NODE_ENV=production
WEB_URL=https://medilinko-emergency.onrender.com
MEDILINKO_BACKEND_URL=https://medilinko-backend.onrender.com
JWT_SECRET=<generate-random-string>
```

### 2️⃣ EmergencyMed Frontend (Render Environment Variables)

```env
REACT_APP_API_URL=https://medilinko-emergency-backend.onrender.com
```

### 3️⃣ MediLinko Backend (Add This Variable on Render)

```env
EMERGENCY_WEB_URL=https://medilinko-emergency.onrender.com
```

### 4️⃣ Flutter App Code Changes

**File: `lib/services/emergency_web_service.dart`** (Lines 10-15)

```dart
class EmergencyWebService {
  static const String _baseUrl = kDebugMode
      ? 'http://10.0.2.2:5000'  // Android emulator
      : 'https://medilinko-emergency-backend.onrender.com';  // 👈 UPDATE
  
  static const String _webBaseUrl = kDebugMode
      ? 'http://localhost:3000'
      : 'https://medilinko-emergency.onrender.com';  // 👈 UPDATE
```

---

## ✅ Deployment Checklist

### Before Deploying:

- [ ] Commit all code changes to GitHub
- [ ] Verify `.env` is in `.gitignore`
- [ ] Update `.env.example` with all required variables
- [ ] Test locally one more time

### Deploy Backend:

1. [ ] Create Render Web Service
2. [ ] Configure build settings (see DEPLOYMENT_GUIDE.md)
3. [ ] Add environment variables
4. [ ] Deploy and copy URL
5. [ ] Test health endpoint: `/api/health`

### Deploy Frontend:

1. [ ] Create Render Static Site
2. [ ] Configure build settings
3. [ ] Add `REACT_APP_API_URL` environment variable
4. [ ] Deploy and copy URL
5. [ ] Test in browser

### Update All Services:

1. [ ] Update EmergencyMed Backend `WEB_URL`
2. [ ] Update MediLinko Backend with `EMERGENCY_WEB_URL`
3. [ ] Update Flutter app URLs
4. [ ] Rebuild Flutter app: `flutter build apk --release`

### Final Testing:

- [ ] Test backend API endpoints
- [ ] Test frontend loads correctly
- [ ] Test user list displays
- [ ] Test QR code generation
- [ ] Scan QR with phone camera
- [ ] Verify profile loads from scan
- [ ] Test from Flutter app

---

## 🔍 Quick Test Commands

### Test Backend Health
```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected:
```json
{"status":"OK","message":"MediLinko Web API is running"}
```

### Test Users Endpoint
```bash
curl https://your-backend-url.onrender.com/api/users
```

Should return array of users.

### Test QR URL for Flutter
```bash
curl https://your-backend-url.onrender.com/api/users/{userId}/qr-url
```

Should return:
```json
{
  "userId": "...",
  "fullName": "...",
  "qrUrl": "https://your-frontend-url/profile/ML-..."
}
```

---

## 🚨 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| CORS Error | Update `allowedOrigins` in `server/index.js` |
| Cannot fetch users | Check `REACT_APP_API_URL` is set correctly |
| QR scan doesn't work | Verify `WEB_URL` in backend env vars |
| Flutter can't connect | Update production URLs in `emergency_web_service.dart` |
| 500 errors | Check Render logs for details |

---

## 📝 Post-Deployment Tasks

1. **Update README.md** with production URLs
2. **Document API endpoints** for future reference
3. **Set up monitoring** (optional: UptimeRobot, Render monitoring)
4. **Share QR codes** with test users
5. **Monitor Render logs** for first 24 hours

---

## 💡 Pro Tips

- **Free Tier Spin-down**: Render free tier sleeps after 15 minutes. First request takes ~30 seconds.
- **Keep Awake**: Use a service like UptimeRobot to ping your backend every 14 minutes
- **Custom Domain**: Consider buying a domain for professional look
- **SSL**: Render provides free SSL automatically
- **Logs**: Check Render dashboard logs if anything goes wrong

---

**Quick Copy-Paste Template for Render Variables:**

```
MONGODB_URI=mongodb+srv://sushilchandaragi_db_user:Sushil1234@cluster0.tkfu1ug.mongodb.net/medilinko
PORT=10000
NODE_ENV=production
WEB_URL=https://YOUR-FRONTEND-URL.onrender.com
MEDILINKO_BACKEND_URL=https://medilinko-backend.onrender.com
JWT_SECRET=CHANGE-THIS-TO-RANDOM-STRING
REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com
```

---

Last Updated: January 20, 2026
