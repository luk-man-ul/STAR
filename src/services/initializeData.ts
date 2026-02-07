import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { mockServices, mockUsers, mockOrders } from '../utils';
import { registerUser } from './authService';

/**
 * Initialize Firebase with seed data
 * Run this once to populate your Firebase database with initial data
 */

export const initializeFirebaseData = async (): Promise<void> => {
  try {
    console.log('🚀 Starting Firebase data initialization...');

    // Check if services already exist
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    
    if (servicesSnapshot.empty) {
      console.log('📦 Seeding services...');
      const batch = writeBatch(db);
      
      mockServices.forEach((service) => {
        const serviceRef = doc(collection(db, 'services'));
        batch.set(serviceRef, service);
      });
      
      await batch.commit();
      console.log('✅ Services seeded successfully');
    } else {
      console.log('ℹ️  Services already exist, skipping...');
    }

    console.log('✅ Firebase initialization complete!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Create user accounts through the registration page');
    console.log('2. Or use these test credentials:');
    console.log('   Customer: customer@example.com / password');
    console.log('   Admin: admin@example.com / password');
    console.log('');
    console.log('⚠️  Note: You need to manually create these users in Firebase Authentication');
    console.log('   or use the registration page in your app.');
    
  } catch (error) {
    console.error('❌ Error initializing Firebase data:', error);
    throw error;
  }
};

// Helper function to check if Firebase is properly configured
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Try to read from Firestore
    await getDocs(collection(db, 'services'));
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.log('');
    console.log('Please check:');
    console.log('1. Firebase config in .env file');
    console.log('2. Firebase project is created');
    console.log('3. Firestore is enabled in Firebase Console');
    console.log('4. Firebase rules allow read/write access');
    return false;
  }
};
