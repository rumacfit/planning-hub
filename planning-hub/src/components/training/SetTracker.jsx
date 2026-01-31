import React from 'react';
import { CheckIcon } from '../common/Icons';
import './SetTracker.css';

const SetTracker = ({ set, exerciseType, onUpdate, onToggleComplete }) => {
  return (
    <div className={`set-tracker ${set.completed ? 'set-complete' : ''}`}>
      <button 
        className="set-check"
        onClick={onToggleComplete}
        aria-label={set.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {set.completed && <CheckIcon size={16} />}
      </button>
      
      <div className="set-number">
        {set.setNum}
      </div>
      
      {exerciseType === 'strength' ? (
        <>
          <input
            type="number"
            className="set-input"
            placeholder="kg"
            value={set.weight}
            onChange={(e) => onUpdate('weight', e.target.value)}
            disabled={set.completed}
          />
          <span className="set-separator">×</span>
          <input
            type="number"
            className="set-input"
            placeholder="reps"
            value={set.reps}
            onChange={(e) => onUpdate('reps', e.target.value)}
            disabled={set.completed}
          />
          {set.previous && (
            <div className="set-previous">
              {set.previous.weight}kg × {set.previous.reps}
            </div>
          )}
        </>
      ) : (
        <>
          <input
            type="text"
            className="set-input"
            placeholder="time"
            value={set.time}
            onChange={(e) => onUpdate('time', e.target.value)}
            disabled={set.completed}
          />
          {set.distance !== undefined && set.distance !== '' && (
            <>
              <input
                type="number"
                className="set-input set-input-small"
                placeholder="km"
                value={set.distance}
                onChange={(e) => onUpdate('distance', e.target.value)}
                disabled={set.completed}
                step="0.1"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SetTracker;
