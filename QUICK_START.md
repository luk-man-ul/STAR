# 🚀 Firebase Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Create Firebase Project (2 min)
```
1. Go to: https://console.firebase.google.com/
2. Click "Add project"
3. Name: dress-stitching-website
4. Disable Analytics
5. Click "Create project"
```

### 2. Enable Services (1 min)
```
Authentication:
- Click "Authentication" → "Get started"
- Enable "Email/Password"
- Save

Firestore:
- Click "Firestore Database" → "Create database"
- Select "Start in test mode"
- Choose location
- Enable
```

### 3. Get Config (1 min)
```
1. Click ⚙️ → "Project settings"
2. Scroll to "Your apps"
3. Click Web icon </> 
4. Register app
5. Copy firebaseConfig
```

### 4. Configure App (1 min)
```bash
# Create .env file
cp .env.example .env

# Paste your Firebase config
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Set Security Rules (30 sec)
```
1. Firestore Database → Rules tab
2. Copy content from firestore.rules
3. Paste and Publish
```

### 6. Create Admin User (1 min)
```
Firebase Console:
1. Authentication → Users → Add user
2. Email: admin@example.com
3. Password: password123
4. Copy User UID

Firestore:
1. Firestore Database → Start collection
2. Collection: users
3. Document ID: (paste UID)
4. Fields:
   - email: admin@example.com
   - name: Admin User
   - phone: +1234567890
   - role: admin
   - createdAt: (timestamp)
   - updatedAt: (timestamp)
5. Save
```

### 7. Seed Services (30 sec)
```bash
# Start app
npm run dev

# Open browser console (F12)
# Run:
initFirebase()
```

### 8. Test! (30 sec)
```
1. Go to http://localhost:5173
2. Login: admin@example.com / password123
3. Or click "Create Account" to register
```

## ✅ Done!

Your app now has:
- ✅ Real Firebase Authentication
- ✅ Cloud Firestore Database
- ✅ Persistent data storage
- ✅ Real-time updates
- ✅ Secure access control

## 🎯 Test Credentials

```
Admin:    admin@example.com / password123
Customer: (create via /register page)
```

## 📚 Full Documentation

- **Detailed Setup:** `FIREBASE_SETUP.md`
- **Integration Guide:** `FIREBASE_INTEGRATION.md`
- **Complete Summary:** `FIREBASE_COMPLETE.md`

## 🐛 Quick Troubleshooting

**Can't connect?**
- Check .env file exists
- Restart dev server: `npm run dev`

**Can't login?**
- Create user in Firebase Authentication
- Create user document in Firestore

**No services?**
- Run `initFirebase()` in browser console

## 🎉 You're Ready!

Start building amazing features with your new Firebase backend!
