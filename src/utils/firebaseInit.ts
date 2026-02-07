/**
 * Firebase Initialization Utility
 * 
 * This file provides a simple way to initialize your Firebase database
 * with seed data. You can call this from the browser console or create
 * a temporary button in your app to run it.
 * 
 * Usage:
 * 1. Make sure Firebase is configured (.env file)
 * 2. Open browser console
 * 3. Import and run: initFirebase()
 */

import { initializeFirebaseData, checkFirebaseConnection } from '../services/initializeData';

export const initFirebase = async () => {
  console.log('🔥 Firebase Initialization Tool');
  console.log('================================');
  console.log('');

  // Step 1: Check connection
  console.log('Step 1: Checking Firebase connection...');
  const isConnected = await checkFirebaseConnection();
  
  if (!isConnected) {
    console.error('❌ Firebase connection failed!');
    console.log('');
    console.log('Please check:');
    console.log('1. .env file exists with correct Firebase config');
    console.log('2. Firebase project is created');
    console.log('3. Firestore is enabled');
    console.log('4. Security rules are published');
    return;
  }

  console.log('✅ Firebase connection successful!');
  console.log('');

  // Step 2: Initialize data
  console.log('Step 2: Initializing database with seed data...');
  try {
    await initializeFirebaseData();
    console.log('');
    console.log('🎉 Firebase initialization complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to /register to create a customer account');
    console.log('2. Or login with admin@example.com (if created)');
    console.log('3. Start using the app!');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
};

// Make it available globally for easy access from console
if (typeof window !== 'undefined') {
  (window as any).initFirebase = initFirebase;
}

export default initFirebase;
