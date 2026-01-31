import React, { useState, useEffect } from 'react';
import { parseWorkoutDescription, getPreviousWorkout } from './workoutParser';
import './TrainingLog.css';

// Icons
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TimerIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="13" r="10"/><polyline points="12,8 12,13 16,15"/><line x1="12" y1="3" x2="12" y2="5"/></svg>;
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const MoreIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;

const TrainingLog = ({ currentDate, events, previousWorkouts, onSave, onFinish, onNavigate }) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [viewDate, setViewDate] = useState(currentDate || new Date());
  
  // Get all events for the current viewing date
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const dateStr = formatDate(viewDate);
  const dayEvents = events.filter(e => e.startDate === dateStr);
  
  // Initialize exercises from ALL events for this day
  useEffect(() => {
    if (dayEvents.length > 0) {
      let allExercises = [];
      dayEvents.forEach(event => {
        if (event.description) {
          const parsed = parseWorkoutDescription(event.description);
          // Add event title context to exercises
          parsed.forEach(ex => {
            ex.eventTitle = event.title;
          });
          allExercises = [...allExercises, ...parsed];
        }
      });
      setExercises(allExercises);
    } else {
      setExercises([]);
    }
  }, [viewDate, events]);
  
  // Timer
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Load previous workouts and populate "previous" data
  useEffect(() => {
    if (exercises.length > 0 && previousWorkouts?.length > 0) {
      const updatedExercises = exercises.map(ex => {
        const prevEx = getPreviousWorkout(ex.name, previousWorkouts);
        if (prevEx && prevEx.sets) {
          return {
            ...ex,
            sets: ex.sets.map((set, i) => ({
              ...set,
              previous: prevEx.sets[i] || prevEx.sets[0] || null // Fall back to first set if index doesn't match
            }))
          };
        }
        return ex;
      });
      setExercises(updatedExercises);
    }
  }, [exercises.length, previousWorkouts]);
  
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
            ? { distance: lastSet.distance, time: '', avgHR: '', pace: '', rpe: '', completed: false }
            : { weight: lastSet.weight, reps: lastSet.reps, completed: false }
          )
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    }));
  };
  
  const handleFinish = () => {
    if (window.confirm('Finish workout and save?')) {
      setIsRunning(false);
      onFinish && onFinish(exercises, timer);
    }
  };
  
  const navigateDay = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + direction);
    setViewDate(newDate);
    setTimer(0);
    setIsRunning(false);
  };
  
  const goToToday = () => {
    setViewDate(new Date());
  };
  
  return (
    <div className="training-log">
      <div className="training-header">
        <button className="icon-btn" onClick={() => setIsRunning(!isRunning)}>
          <TimerIcon />
        </button>
        <div className="timer-display">{formatTime(timer)}</div>
        <button className="finish-btn" onClick={handleFinish}>Finish</button>
      </div>
      
      <div className="workout-title">
        <div className="date-nav">
          <button className="date-nav-btn" onClick={() => navigateDay(-1)}>←</button>
          <div className="date-display">
            <h2>{viewDate.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}</h2>
            {formatDate(viewDate) !== formatDate(new Date()) && (
              <button className="today-btn" onClick={goToToday}>Today</button>
            )}
          </div>
          <button className="date-nav-btn" onClick={() => navigateDay(1)}>→</button>
        </div>
        {dayEvents.length > 0 && (
          <p className="workout-summary">{dayEvents.map(e => e.title).join(' + ')}</p>
        )}
      </div>
      
      {exercises.map(exercise => (
        <div key={exercise.id} className="exercise-block">
          <div className="exercise-header">
            <h3>{exercise.name}</h3>
            <div className="exercise-actions">
              <button className="icon-btn"><LinkIcon /></button>
              <button className="icon-btn"><MoreIcon /></button>
            </div>
          </div>
          
          {exercise.type === 'cardio' ? (
            <CardioExercise 
              exercise={exercise}
              onUpdate={updateSet}
              onToggleComplete={toggleSetComplete}
            />
          ) : (
            <StrengthExercise 
              exercise={exercise}
              onUpdate={updateSet}
              onToggleComplete={toggleSetComplete}
            />
          )}
          
          <button className="add-set-btn" onClick={() => addSet(exercise.id)}>
            <PlusIcon /> Add Set
          </button>
        </div>
      ))}
    </div>
  );
};

const CardioExercise = ({ exercise, onUpdate, onToggleComplete }) => {
  return (
    <div className="sets-table">
      <div className="sets-header">
        <span className="col-set">Set</span>
        <span className="col-previous">Previous</span>
        <span className="col-distance">km</span>
        <span className="col-time">Time</span>
        <span className="col-hr">Avg HR</span>
        <span className="col-check"></span>
      </div>
      
      {exercise.sets.map(set => (
        <div key={set.setNum} className={`set-row ${set.completed ? 'completed' : ''}`}>
          <span className="col-set set-num">{set.setNum}</span>
          <span className="col-previous">
            {set.previous ? (
              <span className="previous-data">
                {set.previous.distance} km | {set.previous.time}
                <br />
                <span className="hr-indicator">HR {set.previous.avgHR}</span>
              </span>
            ) : '—'}
          </span>
          <input 
            type="number" 
            className="col-distance input-field"
            value={set.distance}
            onChange={(e) => onUpdate(exercise.id, set.setNum, 'distance', e.target.value)}
            step="0.1"
          />
          <input 
            type="text" 
            className="col-time input-field"
            value={set.time}
            onChange={(e) => onUpdate(exercise.id, set.setNum, 'time', e.target.value)}
            placeholder="4:05"
          />
          <input 
            type="number" 
            className="col-hr input-field"
            value={set.avgHR}
            onChange={(e) => onUpdate(exercise.id, set.setNum, 'avgHR', e.target.value)}
            placeholder="165"
          />
          <button 
            className={`check-btn ${set.completed ? 'checked' : ''}`}
            onClick={() => onToggleComplete(exercise.id, set.setNum)}
          >
            {set.completed && <CheckIcon />}
          </button>
        </div>
      ))}
    </div>
  );
};

const StrengthExercise = ({ exercise, onUpdate, onToggleComplete }) => {
  return (
    <div className="sets-table">
      <div className="sets-header">
        <span className="col-set">Set</span>
        <span className="col-previous">Previous</span>
        <span className="col-weight">kg</span>
        <span className="col-reps">Reps</span>
        <span className="col-check"></span>
      </div>
      
      {exercise.sets.map(set => (
        <div key={set.setNum} className={`set-row ${set.completed ? 'completed' : ''}`}>
          <span className="col-set set-num">{set.setNum}</span>
          <span className="col-previous">
            {set.previous ? `${set.previous.weight} kg × ${set.previous.reps}` : '—'}
          </span>
          <input 
            type="number" 
            className="col-weight input-field"
            value={set.weight}
            onChange={(e) => onUpdate(exercise.id, set.setNum, 'weight', e.target.value)}
          />
          <input 
            type="number" 
            className="col-reps input-field"
            value={set.reps}
            onChange={(e) => onUpdate(exercise.id, set.setNum, 'reps', e.target.value)}
          />
          <button 
            className={`check-btn ${set.completed ? 'checked' : ''}`}
            onClick={() => onToggleComplete(exercise.id, set.setNum)}
          >
            {set.completed && <CheckIcon />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TrainingLog;
