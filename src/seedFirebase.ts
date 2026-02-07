/**
 * Firebase Data Seeding Script
 * Run this once to populate your Firebase database with initial services data
 * 
 * Usage: Import this in your main.tsx temporarily or run from browser console
 */

import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './config/firebase';

// Services data to seed
const servicesData = [
  {
    name: 'Blouse Stitching',
    description: 'Custom blouse stitching with perfect fit',
    category: 'blouse',
    pricing: [
      { type: 'Simple', price: 500, description: 'Basic blouse design' },
      { type: 'Designer', price: 800, description: 'Designer blouse with embellishments' }
    ],
    estimatedDays: 7,
    requiresMeasurements: true
  },
  {
    name: 'Kurti Stitching',
    description: 'Stylish kurti stitching for all occasions',
    category: 'kurti',
    pricing: [
      { type: 'Casual', price: 600, description: 'Everyday wear kurti' },
      { type: 'Party Wear', price: 1200, description: 'Elegant party wear kurti' }
    ],
    estimatedDays: 5,
    requiresMeasurements: true
  },
  {
    name: 'Bridal Stitching',
    description: 'Exquisite bridal wear stitching',
    category: 'bridal',
    pricing: [
      { type: 'Traditional', price: 5000, description: 'Traditional bridal outfit' },
      { type: 'Designer', price: 10000, description: 'Designer bridal collection' }
    ],
    estimatedDays: 21,
    requiresMeasurements: true
  }
];

export const seedServices = async () => {
  try {
    console.log('🌱 Starting to seed services...');

    // Check if services already exist
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    
    if (!servicesSnapshot.empty) {
      console.log('ℹ️  Services already exist. Skipping seed.');
      console.log(`Found ${servicesSnapshot.size} services in database.`);
      return;
    }

    // Seed services
    const batch = writeBatch(db);
    
    servicesData.forEach((service) => {
      const serviceRef = doc(collection(db, 'services'));
      batch.set(serviceRef, service);
    });
    
    await batch.commit();
    
    console.log('✅ Successfully seeded 3 services!');
    console.log('   - Blouse Stitching');
    console.log('   - Kurti Stitching');
    console.log('   - Bridal Stitching');
    console.log('');
    console.log('🎉 Database is ready to use!');
    
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  }
};

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).seedServices = seedServices;
}
