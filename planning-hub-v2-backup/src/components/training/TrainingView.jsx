import React, { useState, useEffect } from 'react';
import { parseWorkoutDescription } from '../../utils/workoutParser';
import { formatDate } from '../../utils/dateHelpers';
import ExerciseCard from './ExerciseCard';
import WorkoutTimer from './WorkoutTimer';
import Button from '../common/Button';
import { PlayIcon, PauseIcon, CheckIcon } from '../common/Icons';
import './TrainingView.css';

const TrainingView = ({ currentDate, events, onSave }) => {
  const [exercises, setExercises] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const dateStr = formatDate(currentDate);
  const dayEvents = events.filter(e => e.startDate === dateStr);
  
  // Parse exercises when date/events change
  useEffect(() => {
    if (dayEvents.length === 0) {
      setExercises([]);
      return;
    }
    
    let allExercises = [];
    dayEvents.forEach((event, eventIndex) => {
      if (event.description) {
        const parsed = parseWorkoutDescription(event.description);
        // Add event context
        parsed.forEach(ex => {
          ex.eventId = event.id || `event-${eventIndex}`;
          ex.eventTitle = event.title;
        });
        allExercises = [...allExercises, ...parsed];
      }
    });
    
    setExercises(allExercises);
    setTimer(0);
    setIsTimerRunning(false);
  }, [dateStr, events.length]);
  
  // Timer
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  
  const updateSet = (exerciseId, setNum, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => 
            set.setNum === setNum ? { ...set, [field]: value } : set
          )
        };
      }
      return ex;
    }));
  };
  
  const toggleSetComplete = (exerciseId, setNum) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => 
            set.setNum === setNum ? { ...set, completed: !set.completed } : set
          )
        };
      }
      return ex;
    }));
  };
  
  const addSet = (exerciseId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet = {
          setNum: ex.sets.length + 1,
          ...(ex.type === 'cardio' 
            ? { distance: lastSet?.distance || '', time: '', avgHR: '', pace: '', rpe: '', completed: false }
            : { weight: lastSet?.weight || '', reps: lastSet?.reps || '', completed: false }
          ),
          previous: null
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    }));
  };
  
  const handleFinish = () => {
    const completedCount = exercises.filter(e => e.type !== 'header' && e.sets.some(s => s.completed)).length;
    const totalCount = exercises.filter(e => e.type !== 'header').length;
    
    if (completedCount === 0) {
      alert('Complete at least one exercise before finishing');
      return;
    }
    
    const confirmed = window.confirm(`Finish workout? (${completedCount}/${totalCount} exercises tracked)`);
    if (confirmed) {
      setIsTimerRunning(false);
      // Save workout data
      if (onSave) {
        onSave({
          date: dateStr,
          exercises,
          duration: timer,
          completedAt: new Date().toISOString()
        });
      }
      alert('Workout saved! 💪');
    }
  };
  
  const workoutExercises = exercises.filter(e => e.type !== 'header');
  const completedSets = workoutExercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
  const totalSets = workoutExercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  
  if (dayEvents.length === 0) {
    return (
      <div className="training-empty">
        <div className="training-empty-icon">📅</div>
        <h3>No Training Scheduled</h3>
        <p className="text-secondary">Add a training event to your calendar to get started</p>
      </div>
    );
  }
  
  return (
    <div className="training-view">
      <div className="training-header">
        <div className="training-info">
          <h2>{dayEvents[0]?.title || 'Training'}</h2>
          {dayEvents.length > 1 && (
            <p className="text-secondary text-sm">{dayEvents.length} sessions planned</p>
          )}
        </div>
        
        <WorkoutTimer 
          seconds={timer}
          isRunning={isTimerRunning}
          onToggle={() => setIsTimerRunning(!isTimerRunning)}
        />
      </div>
      
      {workoutExercises.length > 0 && (
        <div className="training-progress">
          <div className="training-progress-bar">
            <div 
              className="training-progress-fill" 
              style={{ width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%` }}
            />
          </div>
          <div className="training-progress-text">
            {completedSets} / {totalSets} sets completed
          </div>
        </div>
      )}
      
      <div className="training-exercises">
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={updateSet}
            onToggleComplete={toggleSetComplete}
            onAddSet={addSet}
          />
        ))}
      </div>
      
      {workoutExercises.length > 0 && (
        <div className="training-actions">
          <Button
            variant="success"
            size="large"
            fullWidth
            onClick={handleFinish}
            icon={<CheckIcon size={20} />}
          >
            Finish Workout
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrainingView;
