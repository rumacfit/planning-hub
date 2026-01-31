// Debug script to check Firebase data
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCDc3hVdkpf39_HjesIy8rIxrbgB25c600",
  authDomain: "planning-hub-cd575.firebaseapp.com",
  databaseURL: "https://planning-hub-cd575-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "planning-hub-cd575",
  storageBucket: "planning-hub-cd575.firebasestorage.app",
  messagingSenderId: "356313624334",
  appId: "1:356313624334:web:b8752506b98beaba2f315f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function checkFirebaseData() {
  try {
    const dataRef = ref(database, 'planningHub');
    const snapshot = await get(dataRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      console.log('\n📊 FIREBASE DATA SUMMARY\n');
      
      // Check events
      if (data.events) {
        console.log('📅 EVENTS:');
        const events = Object.values(data.events);
        console.log(`   Total events: ${events.length}`);
        
        // Filter February 2026 events
        const feb2026Events = events.filter(e => 
          e.startDate && e.startDate.startsWith('2026-02')
        );
        
        console.log(`   February 2026 events: ${feb2026Events.length}\n`);
        
        // Show each event with description preview
        feb2026Events.forEach(event => {
          console.log(`   📌 ${event.startDate} - ${event.title}`);
          if (event.description) {
            const preview = event.description.substring(0, 100).replace(/\n/g, ' ');
            console.log(`      "${preview}${event.description.length > 100 ? '...' : ''}"`);
          } else {
            console.log('      ⚠️ NO DESCRIPTION');
          }
          console.log('');
        });
        
        // Check specific days Nathan mentioned
        const wednesday = events.find(e => e.startDate === '2026-02-04');
        const monday = events.find(e => e.startDate === '2026-02-02');
        const tuesday = events.find(e => e.startDate === '2026-02-03');
        
        console.log('\n🔍 SPECIFIC DAYS CHECK:\n');
        
        console.log('   Wednesday Feb 4:', wednesday ? 
          `✅ ${wednesday.title} - ${wednesday.description ? `${wednesday.description.length} chars` : 'NO DESCRIPTION'}` : 
          '❌ NOT FOUND');
          
        console.log('   Monday Feb 2:', monday ? 
          `✅ ${monday.title} - ${monday.description ? `${monday.description.length} chars` : 'NO DESCRIPTION'}` : 
          '❌ NOT FOUND');
          
        console.log('   Tuesday Feb 3:', tuesday ? 
          `✅ ${tuesday.title} - ${tuesday.description ? `${tuesday.description.length} chars` : 'NO DESCRIPTION'}` : 
          '❌ NOT FOUND');
          
      } else {
        console.log('❌ No events found in Firebase');
      }
      
      // Check other data
      if (data.meals) console.log('\n🍽️  Meals data: YES');
      if (data.tasks) console.log('✅ Tasks data: YES');
      
    } else {
      console.log('❌ No data found in Firebase at /planningHub');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkFirebaseData();
