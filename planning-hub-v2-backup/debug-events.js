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

async function debugEvents() {
  try {
    const eventsRef = ref(database, 'events');
    const snapshot = await get(eventsRef);
    
    if (snapshot.exists()) {
      const events = snapshot.val();
      const eventArray = Object.entries(events).map(([id, data]) => ({ id, ...data }));
      
      // Filter to Feb 2026 events with descriptions
      const febEvents = eventArray.filter(e => 
        e.startDate && e.startDate.startsWith('2026-02') && e.description
      ).slice(0, 7); // First 7 days
      
      console.log('\n=== FITR Events (Feb 2026) ===\n');
      
      febEvents.forEach(event => {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Date: ${event.startDate}`);
        console.log(`Title: ${event.title}`);
        console.log(`Description:\n${event.description}`);
        console.log('='.repeat(80));
      });
      
    } else {
      console.log('No events found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugEvents();
