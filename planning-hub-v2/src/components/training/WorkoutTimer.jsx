import React from 'react';
import { PlayIcon, PauseIcon } from '../common/Icons';
import { formatTime } from '../../utils/dateHelpers';
import './WorkoutTimer.css';

const WorkoutTimer = ({ seconds, isRunning, onToggle }) => {
  return (
    <div className="workout-timer">
      <button className="timer-button" onClick={onToggle}>
        {isRunning ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
      </button>
      <div className="timer-display">
        {formatTime(seconds)}
      </div>
    </div>
  );
};

export default WorkoutTimer;
