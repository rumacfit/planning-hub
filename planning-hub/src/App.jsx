import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import CalendarView from './components/calendar/CalendarView';
import TrainingView from './components/training/TrainingView';
import MealPlanner from './components/meals/MealPlanner';
import TaskList from './components/tasks/TaskList';
import { subscribeToData, saveData } from './utils/firebase';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('training');
  const [data, setData] = useState({
    events: [],
    meals: [],
    tasks: [],
    workouts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Subscribe to Firebase data
  useEffect(() => {
    const unsubscribe = subscribeToData((firebaseData) => {
      console.log('Firebase data loaded:', firebaseData);
      setData({
        events: firebaseData?.events ? Object.values(firebaseData.events) : [],
        meals: firebaseData?.meals ? Object.values(firebaseData.meals) : [],
        tasks: firebaseData?.tasks ? Object.values(firebaseData.tasks) : [],
        workouts: firebaseData?.workouts ? Object.values(firebaseData.workouts) : []
      });
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const handleSaveWorkout = async (workout) => {
    console.log('Saving workout:', workout);
    
    // Add workout to local state
    const newWorkouts = [...data.workouts, workout];
    
    // Save to Firebase
    const newData = {
      ...data,
      workouts: newWorkouts
    };
    
    await saveData(newData);
  };
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }
  
  return (
    <Layout
      currentDate={currentDate}
      onDateChange={setCurrentDate}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'calendar' && (
        <CalendarView
          currentDate={currentDate}
          events={data.events}
        />
      )}
      
      {activeTab === 'training' && (
        <TrainingView
          currentDate={currentDate}
          events={data.events}
          onSave={handleSaveWorkout}
        />
      )}
      
      {activeTab === 'meals' && (
        <MealPlanner
          currentDate={currentDate}
        />
      )}
      
      {activeTab === 'tasks' && (
        <TaskList
          currentDate={currentDate}
        />
      )}
    </Layout>
  );
}

export default App;
