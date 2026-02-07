import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase.node.js';

async function listServices() {
  try {
    console.log('📋 Fetching services from Firebase...\n');
    
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    
    if (snapshot.size === 0) {
      console.log('⚠️  No services found in Firebase.');
      return;
    }
    
    console.log(`✅ Found ${snapshot.size} service(s):\n`);
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.name}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Category: ${data.category}`);
      console.log(`   Price: ₹${data.pricing?.[0]?.price || 'N/A'}`);
      console.log(`   Days: ${data.estimatedDays || 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error listing services:', error);
    throw error;
  }
}

listServices()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
