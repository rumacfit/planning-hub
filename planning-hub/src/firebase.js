// Firebase configuration for Planning Hub
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCDc3hVdkpf39_HjesIy8rIxrbgB25c600",
  authDomain: "planning-hub-cd575.firebaseapp.com",
  databaseURL: "https://planning-hub-cd575-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "planning-hub-cd575",
  storageBucket: "planning-hub-cd575.firebasestorage.app",
  messagingSenderId: "356313624334",
  appId: "1:356313624334:web:b8752506b98beaba2f315f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
export const dataRef = ref(database, 'planningHub');

// Save data to Firebase
export const saveData = (data) => {
  return set(dataRef, data);
};

// Subscribe to data changes
export const subscribeToData = (callback) => {
  return onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export { database };
