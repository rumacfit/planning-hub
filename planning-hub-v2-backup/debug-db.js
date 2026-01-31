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

async function debugDB() {
  try {
    // Check root structure
    const rootRef = ref(database);
    const snapshot = await get(rootRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Database keys:', Object.keys(data));
      
      // Check for user-specific data
      if (data.users) {
        console.log('\nUser keys:', Object.keys(data.users));
        
        // Get first user
        const firstUserId = Object.keys(data.users)[0];
        console.log('\nFirst user ID:', firstUserId);
        console.log('User data keys:', Object.keys(data.users[firstUserId]));
        
        // Check events under user
        if (data.users[firstUserId].events) {
          const events = data.users[firstUserId].events;
          const eventArray = Object.entries(events).map(([id, e]) => ({ id, ...e }));
          
          // Get Feb 2026 events
          const febEvents = eventArray.filter(e => 
            e.startDate && e.startDate.startsWith('2026-02')
          ).slice(0, 3);
          
          console.log(`\n\n=== Sample Events (${febEvents.length}) ===`);
          febEvents.forEach(e => {
            console.log(`\n${'-'.repeat(80)}`);
            console.log(`Date: ${e.startDate} | Title: ${e.title}`);
            if (e.description) {
              console.log(`Description (first 500 chars):\n${e.description.substring(0, 500)}`);
            }
          });
        }
      }
    } else {
      console.log('Database is empty');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugDB();
