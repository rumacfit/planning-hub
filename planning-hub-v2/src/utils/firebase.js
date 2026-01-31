// Firebase configuration and utilities
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';

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

// Database reference
export const dataRef = ref(database, 'planningHub');

// Save all data to Firebase
export const saveData = async (data) => {
  try {
    await set(dataRef, data);
    return { success: true };
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return { success: false, error };
  }
};

// Subscribe to all data changes
export const subscribeToData = (callback) => {
  return onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  }, (error) => {
    console.error('Error subscribing to Firebase:', error);
    callback({});
  });
};

// Get data once (without subscription)
export const getData = async () => {
  try {
    const snapshot = await get(dataRef);
    return snapshot.val() || {};
  } catch (error) {
    console.error('Error getting Firebase data:', error);
    return {};
  }
};

export { database };
