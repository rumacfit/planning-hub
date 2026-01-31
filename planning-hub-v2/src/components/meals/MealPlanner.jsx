import React from 'react';
import './MealPlanner.css';

const MealPlanner = ({ currentDate }) => {
  return (
    <div className="meal-planner">
      <div className="meal-header">
        <h2>Meal Planning</h2>
      </div>
      
      <div className="meal-empty">
        <div className="meal-empty-icon">🍽️</div>
        <h3>Meal Planning</h3>
        <p className="text-secondary">
          Meal planning feature is being rebuilt.
        </p>
        <p className="text-secondary text-sm">
          Track your nutrition and plan meals for the week.
        </p>
      </div>
    </div>
  );
};

export default MealPlanner;
