# 🔥 Firebase Backend Setup Guide

This guide will help you set up Firebase as the backend for your Dress Stitching Website.

## 📋 Prerequisites

- Google account
- Node.js installed
- Project already has Firebase SDK installed

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `dress-stitching-website` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### 2. Enable Firebase Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" under Sign-in method
4. Enable "Email/Password"
5. Click "Save"

### 3. Enable Cloud Firestore

1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (we'll add security rules later)
4. Choose your Cloud Firestore location (select closest to your users)
5. Click "Enable"

### 4. Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the Web icon `</>` to add a web app
5. Register app with nickname: "Dress Stitching Web App"
6. Copy the `firebaseConfig` object

### 5. Configure Your Project

1. Create a `.env` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Paste your Firebase config values into `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 6. Set Up Firestore Security Rules

1. In Firebase Console, go to "Firestore Database"
2. Click on "Rules" tab
3. Replace the rules with the content from `firestore.rules` file
4. Click "Publish"

### 7. Create Initial Admin User

**Option A: Using Firebase Console (Recommended)**

1. Go to Firebase Console > Authentication > Users
2. Click "Add user"
3. Email: `admin@example.com`
4. Password: `password123` (change this!)
5. Click "Add user"
6. Copy the User UID
7. Go to Firestore Database
8. Click "Start collection"
9. Collection ID: `users`
10. Document ID: (paste the User UID)
11. Add fields:
    - `email`: admin@example.com
    - `name`: Admin User
    - `phone`: +1234567890
    - `role`: admin
    - `createdAt`: (timestamp - current time)
    - `updatedAt`: (timestamp - current time)
12. Click "Save"

**Option B: Using Registration Page**

1. Start your app: `npm run dev`
2. Create a registration page (or use the login page)
3. Register with admin email
4. Manually update the user's role to 'admin' in Firestore Console

### 8. Initialize Database with Services

1. Open your browser console
2. Run the initialization function:

```javascript
import { initializeFirebaseData } from './src/services/initializeData';
initializeFirebaseData();
```

Or add a button in your app temporarily to run this function.

### 9. Test the Connection

1. Start your development server:

```bash
npm run dev
```

2. Open the app in your browser
3. Try logging in with your admin credentials
4. Check the browser console for any errors

## 🔒 Firestore Security Rules

The security rules ensure:
- ✅ Users can only read/write their own data
- ✅ Admins can access all data
- ✅ Public users can read services
- ✅ Authenticated users can create orders/bookings

## 📊 Database Structure

```
firestore/
├── users/
│   └── {userId}/
│       ├── email
│       ├── name
│       ├── phone
│       ├── role (customer | admin)
│       ├── createdAt
│       └── updatedAt
│
├── services/
│   └── {serviceId}/
│       ├── name
│       ├── description
│       ├── category
│       ├── pricing[]
│       ├── estimatedDays
│       └── requiresMeasurements
│
├── orders/
│   └── {orderId}/
│       ├── customerId
│       ├── serviceId
│       ├── status
│       ├── appointmentDate
│       ├── measurements{}
│       ├── specialInstructions
│       ├── createdAt
│       └── updatedAt
│
└── bookings/
    └── {bookingId}/
        ├── customerId
        ├── serviceId
        ├── appointmentDate
        ├── measurementType
        ├── measurements{}
        └── status
```

## 🧪 Testing

Test credentials (after setup):
- **Admin**: admin@example.com / password123
- **Customer**: customer@example.com / password123

## 🐛 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that your `.env` file exists and has correct values
- Restart your dev server after creating `.env`

### "Missing or insufficient permissions"
- Check Firestore security rules are published
- Ensure user is authenticated
- Verify user role in Firestore

### "Firebase: Error (auth/user-not-found)"
- Create the user in Firebase Authentication first
- Then create corresponding document in Firestore users collection

### Services not loading
- Run the initialization script
- Check Firestore console to verify services exist
- Check browser console for errors

## 🎉 Success!

Once setup is complete, your app will:
- ✅ Use real Firebase Authentication
- ✅ Store data in Cloud Firestore
- ✅ Persist data across sessions
- ✅ Support real-time updates
- ✅ Scale automatically

## 📚 Next Steps

1. **Add more features**:
   - Image upload for orders
   - Email notifications
   - Payment integration

2. **Improve security**:
   - Add email verification
   - Implement password reset
   - Add rate limiting

3. **Deploy**:
   - Deploy to Firebase Hosting
   - Set up custom domain
   - Enable analytics

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
