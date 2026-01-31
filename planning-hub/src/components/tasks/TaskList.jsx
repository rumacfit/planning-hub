import React from 'react';
import './TaskList.css';

const TaskList = ({ currentDate }) => {
  return (
    <div className="task-list">
      <div className="task-header">
        <h2>Tasks</h2>
      </div>
      
      <div className="task-empty">
        <div className="task-empty-icon">✅</div>
        <h3>Task Management</h3>
        <p className="text-secondary">
          Task management feature is being rebuilt.
        </p>
        <p className="text-secondary text-sm">
          Stay organized with your daily tasks and to-dos.
        </p>
      </div>
    </div>
  );
};

export default TaskList;
