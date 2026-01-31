import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCDc3hVdkpf39_HjesIy8rIxrbgB25c600",
  authDomain: "planning-hub-cd575.firebaseapp.com",
  databaseURL: "https://planning-hub-cd575-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "planning-hub-cd575",
  storageBucket: "planning-hub-cd575.firebasestorage.app",
  messagingSenderId: "356313624334",
  appId: "1:356313624334:web:79c2bc68e0c6c94c0d8f3e"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function getFITRData() {
  try {
    const hubRef = ref(database, 'planningHub');
    const snapshot = await get(hubRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('planningHub keys:', Object.keys(data));
      
      if (data.events) {
        const events = data.events;
        const eventArray = Object.entries(events).map(([id, e]) => ({ id, ...e }));
        
        // Get Feb 2026 events with descriptions
        const febEvents = eventArray
          .filter(e => e.startDate && e.startDate.startsWith('2026-02') && e.description)
          .sort((a, b) => a.startDate.localeCompare(b.startDate))
          .slice(0, 7);
        
        console.log(`\n=== FITR Events Found: ${febEvents.length} ===\n`);
        
        febEvents.forEach(e => {
          console.log(`\n${'='.repeat(100)}`);
          console.log(`DATE: ${e.startDate}`);
          console.log(`TITLE: ${e.title}`);
          console.log(`\nDESCRIPTION:`);
          console.log(e.description);
          console.log('='.repeat(100));
        });
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getFITRData();
