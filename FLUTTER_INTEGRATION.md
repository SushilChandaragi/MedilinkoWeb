# Flutter App Integration Guide

## Overview
This guide explains how to integrate the web-based QR code system with your existing Flutter MediLinko app.

## How It Works

1. **Backend stores QR code IDs**: Each user in the MongoDB database now has a `qrCodeId` field (e.g., `ML-DOCTOR-1768849586375-n1taw86t9`)

2. **Flutter app gets the QR URL**: Your Flutter app can call the backend API to get the web URL for each user

3. **Flutter displays QR code**: Use a QR code package in Flutter to encode and display the web URL

4. **Users scan with any scanner**: When scanned, the QR redirects to the web profile page

## API Endpoint for Flutter

### Get QR URL for a User

**Endpoint:** `GET /api/users/:userId/qr-url`

**Example Request:**
```dart
// In your Flutter app
final response = await http.get(
  Uri.parse('http://localhost:5000/api/users/67733a1d80bd2b3c3f1a11d3/qr-url')
);

final data = jsonDecode(response.body);
print(data['qrUrl']); // http://localhost:3000/profile/ML-DOCTOR-1768849586375-n1taw86t9
```

**Response:**
```json
{
  "userId": "67733a1d80bd2b3c3f1a11d3",
  "fullName": "Dr. John Doe",
  "role": "doctor",
  "qrCodeId": "ML-DOCTOR-1768849586375-n1taw86t9",
  "qrUrl": "http://localhost:3000/profile/ML-DOCTOR-1768849586375-n1taw86t9",
  "message": "Encode this qrUrl in the QR code for the user"
}
```

## Flutter Implementation Example

### 1. Add QR Code Package
```yaml
# pubspec.yaml
dependencies:
  qr_flutter: ^4.1.0
  http: ^1.1.0
```

### 2. Fetch QR URL from Backend
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class UserService {
  static const String baseUrl = 'http://localhost:5000/api';
  
  Future<String> getQrUrl(String userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/users/$userId/qr-url'),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['qrUrl'];
    } else {
      throw Exception('Failed to load QR URL');
    }
  }
}
```

### 3. Display QR Code in Flutter
```dart
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class UserQrCode extends StatelessWidget {
  final String userId;
  
  const UserQrCode({Key? key, required this.userId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: UserService().getQrUrl(userId),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Column(
            children: [
              QrImageView(
                data: snapshot.data!, // The web URL
                version: QrVersions.auto,
                size: 200.0,
              ),
              SizedBox(height: 16),
              Text(
                'Scan with any QR scanner',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
            ],
          );
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        }
        return CircularProgressIndicator();
      },
    );
  }
}
```

## QR Code URL Format

All QR codes encode URLs in this format:
```
http://localhost:3000/profile/{qrCodeId}
```

For production, replace `localhost:3000` with your actual web domain:
```
https://medilinko.com/profile/{qrCodeId}
```

## Environment Variable for Production

Update your `.env` file:
```env
# For local development
WEB_URL=http://localhost:3000

# For production
# WEB_URL=https://medilinko.com
```

## Scanning Flow

1. User opens Flutter app → Views their profile
2. App displays QR code (encoded with web URL)
3. Another person scans QR with Google Lens / Camera app
4. Scanner reads the URL: `http://localhost:3000/profile/ML-DOCTOR-...`
5. Browser opens → Shows user profile from web interface
6. **No app installation required** for the scanner!

## Important Notes

- ✅ All 44 existing users already have QR codes generated
- ✅ QR codes work with any scanner (Google Lens, Camera apps, dedicated QR scanners)
- ✅ No need to install the Flutter app to view profiles
- ✅ Web interface works on any device with a browser
- ⚠️ For production, update `WEB_URL` environment variable to your actual domain

## Testing

1. Start the backend: `node server/index.js`
2. Test the API:
   ```bash
   curl http://localhost:5000/api/users/{userId}/qr-url
   ```
3. Use the returned `qrUrl` in your Flutter QR code widget
4. Scan with your phone's camera to test the flow

## Next Steps

1. Replace `localhost:5000` with your deployed backend URL
2. Replace `localhost:3000` with your deployed frontend URL
3. Update the `WEB_URL` environment variable
4. Deploy both backend and frontend
5. Update Flutter app to use production URLs
