import React from 'react';
import { formatDate, MONTHS, addDays } from '../../utils/dateHelpers';
import { ChevronLeftIcon, ChevronRightIcon } from '../common/Icons';
import './Header.css';

const Header = ({ currentDate, onDateChange }) => {
  const today = new Date();
  const isToday = formatDate(currentDate) === formatDate(today);
  
  const goToPreviousDay = () => {
    onDateChange(addDays(currentDate, -1));
  };
  
  const goToNextDay = () => {
    onDateChange(addDays(currentDate, 1));
  };
  
  const goToToday = () => {
    onDateChange(today);
  };
  
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];
  const month = MONTHS[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-date-nav">
          <button className="header-nav-btn" onClick={goToPreviousDay} aria-label="Previous day">
            <ChevronLeftIcon size={24} />
          </button>
          
          <div className="header-date">
            <div className="header-day-of-week">{dayOfWeek}</div>
            <div className="header-date-text">
              {month} {day}, {year}
            </div>
          </div>
          
          <button className="header-nav-btn" onClick={goToNextDay} aria-label="Next day">
            <ChevronRightIcon size={24} />
          </button>
        </div>
        
        {!isToday && (
          <button className="header-today-btn" onClick={goToToday}>
            Today
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
