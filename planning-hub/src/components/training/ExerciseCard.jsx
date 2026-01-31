import React from 'react';
import SetTracker from './SetTracker';
import { PlusIcon } from '../common/Icons';
import Card from '../common/Card';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise, onUpdateSet, onToggleComplete, onAddSet }) => {
  if (exercise.type === 'header') {
    return (
      <div className="exercise-header">
        <h3>{exercise.name}</h3>
      </div>
    );
  }
  
  const completedSets = exercise.sets.filter(s => s.completed).length;
  const totalSets = exercise.sets.length;
  const allComplete = completedSets === totalSets && totalSets > 0;
  
  return (
    <Card className={`exercise-card ${allComplete ? 'exercise-complete' : ''}`} padding="normal">
      <div className="exercise-card-header">
        <div className="exercise-name">
          <span className="exercise-icon">{exercise.type === 'cardio' ? '🏃' : '💪'}</span>
          <h4>{exercise.name}</h4>
        </div>
        {exercise.eventTitle && (
          <span className="exercise-source">{exercise.eventTitle}</span>
        )}
      </div>
      
      <div className="exercise-sets">
        {exercise.sets.map(set => (
          <SetTracker
            key={set.setNum}
            set={set}
            exerciseType={exercise.type}
            onUpdate={(field, value) => onUpdateSet(exercise.id, set.setNum, field, value)}
            onToggleComplete={() => onToggleComplete(exercise.id, set.setNum)}
          />
        ))}
      </div>
      
      <button className="exercise-add-set" onClick={() => onAddSet(exercise.id)}>
        <PlusIcon size={16} />
        <span>Add Set</span>
      </button>
      
      {completedSets > 0 && (
        <div className="exercise-progress">
          {completedSets} / {totalSets} sets complete
        </div>
      )}
    </Card>
  );
};

export default ExerciseCard;
