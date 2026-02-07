/**
 * Firebase Diagnostic Tool
 * Run this in browser console to check your Firebase setup
 */

import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from './config/firebase';

export const checkFirebaseSetup = async () => {
  console.log('🔍 Firebase Diagnostic Check');
  console.log('================================');
  console.log('');

  try {
    // Check 1: Firebase Connection
    console.log('1️⃣ Checking Firebase connection...');
    try {
      await getDocs(collection(db, 'services'));
      console.log('   ✅ Firebase connection successful');
    } catch (error: any) {
      console.error('   ❌ Firebase connection failed:', error.message);
      console.log('   → Check your .env file configuration');
      return;
    }

    // Check 2: Services Collection
    console.log('');
    console.log('2️⃣ Checking services collection...');
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    if (servicesSnapshot.empty) {
      console.log('   ⚠️  No services found');
      console.log('   → Run: seedServices()');
    } else {
      console.log(`   ✅ Found ${servicesSnapshot.size} services`);
      servicesSnapshot.forEach(doc => {
        console.log(`      - ${doc.data().name}`);
      });
    }

    // Check 3: Users Collection
    console.log('');
    console.log('3️⃣ Checking users collection...');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (usersSnapshot.empty) {
      console.log('   ❌ No users found in Firestore');
      console.log('   → You need to create user documents in Firestore');
      console.log('');
      console.log('   Steps to fix:');
      console.log('   1. Go to Firebase Console → Firestore Database');
      console.log('   2. Create collection: users');
      console.log('   3. Add document with your admin user UID');
      console.log('   4. Add fields: email, name, phone, role, createdAt, updatedAt');
    } else {
      console.log(`   ✅ Found ${usersSnapshot.size} user(s)`);
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`      - ${data.email} (${data.role})`);
      });
    }

    // Check 4: Authentication Users
    console.log('');
    console.log('4️⃣ Checking Firebase Authentication...');
    console.log('   ℹ️  Current auth state:', auth.currentUser ? 'Logged in' : 'Not logged in');
    if (auth.currentUser) {
      console.log(`   User: ${auth.currentUser.email}`);
      console.log(`   UID: ${auth.currentUser.uid}`);
    }

    console.log('');
    console.log('================================');
    console.log('');
    console.log('📝 Summary:');
    console.log('   To login, you need:');
    console.log('   1. User in Firebase Authentication (email/password)');
    console.log('   2. User document in Firestore users collection');
    console.log('   3. Both must have matching email and UID');
    console.log('');
    console.log('💡 Common Issues:');
    console.log('   - "Invalid email or password" = User not in Authentication');
    console.log('   - Login works but no role = User document missing in Firestore');
    console.log('   - Wrong role shown = Check role field in Firestore document');

  } catch (error: any) {
    console.error('❌ Diagnostic check failed:', error);
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).checkFirebaseSetup = checkFirebaseSetup;
}
