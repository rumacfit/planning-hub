import React from 'react';
import Card from '../common/Card';
import './CalendarView.css';

const CalendarView = ({ currentDate, events, onAddEvent }) => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const dateStr = formatDate(currentDate);
  const dayEvents = events.filter(e => e.startDate === dateStr);
  
  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>Today's Schedule</h2>
      </div>
      
      {dayEvents.length === 0 ? (
        <div className="calendar-empty">
          <div className="calendar-empty-icon">📅</div>
          <h3>No events today</h3>
          <p className="text-secondary">Your day is open</p>
        </div>
      ) : (
        <div className="calendar-events">
          {dayEvents.map((event, idx) => (
            <Card key={idx} padding="normal" hover>
              <h4>{event.title}</h4>
              {event.description && (
                <p className="text-secondary text-sm event-preview">
                  {event.description.substring(0, 150)}...
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
      
      <div className="calendar-notice">
        <p className="text-secondary text-sm">
          ℹ️ Full calendar and event management coming soon. 
          For now, use the Training tab to track workouts.
        </p>
      </div>
    </div>
  );
};

export default CalendarView;
