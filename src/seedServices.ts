import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config/firebase.node.js';

const services = [
  {
    id: '1',
    name: 'Blouse Stitching',
    description: 'Custom blouse tailoring with perfect fit',
    category: 'blouse',
    pricing: [
      { type: 'Basic', price: 500, description: 'Simple design with standard fabric' },
      { type: 'Premium', price: 800, description: 'Designer blouse with embellishments' }
    ],
    estimatedDays: 7,
    requiresMeasurements: true
  },
  {
    id: '2',
    name: 'Kurti Stitching',
    description: 'Custom kurti tailoring in various styles',
    category: 'kurti',
    pricing: [
      { type: 'Basic', price: 800, description: 'Simple kurti design' },
      { type: 'Premium', price: 1200, description: 'Designer kurti with embroidery' }
    ],
    estimatedDays: 10,
    requiresMeasurements: true
  },
  {
    id: '3',
    name: 'Bridal Stitching',
    description: 'Custom bridal wear with intricate designs',
    category: 'bridal',
    pricing: [
      { type: 'Premium', price: 5000, description: 'Elaborate bridal design with heavy work' },
      { type: 'Luxury', price: 10000, description: 'Premium bridal wear with designer embellishments' }
    ],
    estimatedDays: 21,
    requiresMeasurements: true
  },
  {
    id: '4',
    name: 'Saree Blouse',
    description: 'Saree blouse stitching with perfect fit',
    category: 'blouse',
    pricing: [
      { type: 'Basic', price: 400, description: 'Simple saree blouse' },
      { type: 'Designer', price: 700, description: 'Designer saree blouse with work' }
    ],
    estimatedDays: 5,
    requiresMeasurements: true
  },
  {
    id: '5',
    name: 'Salwar Kameez',
    description: 'Complete salwar kameez stitching',
    category: 'salwar',
    pricing: [
      { type: 'Basic', price: 1000, description: 'Simple salwar kameez' },
      { type: 'Premium', price: 1500, description: 'Designer salwar kameez' }
    ],
    estimatedDays: 12,
    requiresMeasurements: true
  },
  {
    id: '6',
    name: 'Alterations',
    description: 'Clothing alterations and adjustments',
    category: 'alterations',
    pricing: [
      { type: 'Basic', price: 200, description: 'Simple alterations' },
      { type: 'Complex', price: 500, description: 'Complex alterations' }
    ],
    estimatedDays: 3,
    requiresMeasurements: false
  }
];

async function seedServices() {
  try {
    console.log('🌱 Starting to seed services...');
    
    // Check if services already exist
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    
    if (snapshot.size > 0) {
      console.log(`⚠️  Services collection already has ${snapshot.size} documents.`);
      console.log('Skipping seed to avoid duplicates.');
      console.log('If you want to re-seed, delete the services collection first.');
      return;
    }
    
    // Add each service
    for (const service of services) {
      const { id, ...serviceData } = service; // Remove the id field
      const docRef = await addDoc(servicesRef, serviceData);
      console.log(`✅ Added service: ${service.name} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Successfully seeded all services!');
    console.log('\n📋 Summary:');
    console.log(`   - Total services added: ${services.length}`);
    console.log('   - Collection: services');
    console.log('\n✨ You can now create bookings with these services!');
    
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  }
}

// Run the seed function
seedServices()
  .then(() => {
    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  });
