import React, { useState, useEffect } from 'react';
import './App.css';

// Icons as simple SVG components
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,6 15,12 9,18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// Color palette for staff and events
const COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // orange
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // deep orange
  '#6366F1', // indigo
  '#22C55E', // lime
];

// Helper functions
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Initial sample data
const initialStaff = [
  { id: 1, name: 'Karen McElroy', email: 'karen@example.com', position: 'Manager', color: '#3B82F6' },
  { id: 2, name: 'Nathan McElroy', email: 'nathan@example.com', position: 'Coach', color: '#10B981' },
  { id: 3, name: 'Ruby Lewis', email: 'ruby@example.com', position: 'Coach', color: '#EC4899' },
];

const initialEvents = [
  { id: 1, title: 'Team Meeting', date: '2025-12-29', startTime: '09:00', endTime: '10:00', location: 'Office', staffId: 1, color: '#3B82F6' },
  { id: 2, title: 'Client Session', date: '2025-12-30', startTime: '14:00', endTime: '15:00', location: 'Studio', staffId: 2, color: '#10B981' },
  { id: 3, title: 'Inspection', date: '2026-01-09', startTime: '10:00', endTime: '11:00', location: '30/110 Reynolds street, Balmain', staffId: 1, color: '#3B82F6' },
];

const initialTasks = [
  { id: 1, title: 'Update member records', description: 'Review and update all member contact info', dueDate: '2025-12-28', assignedTo: 1, status: 'pending', priority: 'high' },
  { id: 2, title: 'Order equipment', description: 'New kettlebells and resistance bands', dueDate: '2025-12-30', assignedTo: 2, status: 'pending', priority: 'medium' },
];

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Color Picker Component
const ColorPicker = ({ selectedColor, onSelect }) => (
  <div className="color-picker">
    <label>Color</label>
    <div className="color-options">
      {COLORS.map(color => (
        <button
          key={color}
          className={`color-option ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  </div>
);

// Mini Calendar for Year View
const MiniCalendar = ({ year, month, events, selectedStaffId, staff, onDateClick }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="mini-day empty" />);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    
    // Get events for this day
    const dayEvents = events.filter(e => {
      if (e.date !== dateStr) return false;
      if (selectedStaffId === 'all') return true;
      return e.staffId === selectedStaffId;
    });
    
    const hasEvents = dayEvents.length > 0;
    
    days.push(
      <div 
        key={day} 
        className={`mini-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
        onClick={() => onDateClick(dateStr)}
        title={hasEvents ? dayEvents.map(e => e.title).join(', ') : ''}
      >
        <span className="day-number">{day}</span>
        {hasEvents && selectedStaffId === 'all' && (
          <div className="event-dots">
            {dayEvents.slice(0, 3).map((e, i) => (
              <span key={i} className="event-dot" style={{ backgroundColor: e.color }} />
            ))}
          </div>
        )}
        {hasEvents && selectedStaffId !== 'all' && (
          <div className="event-indicator" style={{ backgroundColor: staff.find(s => s.id === selectedStaffId)?.color }} />
        )}
      </div>
    );
  }
  
  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">{MONTHS[month]}</div>
      <div className="mini-calendar-days-header">
        {DAYS_SHORT.map((d, i) => <div key={i} className="day-header">{d}</div>)}
      </div>
      <div className="mini-calendar-grid">
        {days}
      </div>
    </div>
  );
};

// Add/Edit Event Modal
const EventModal = ({ isOpen, onClose, onSave, event, staff }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: formatDate(new Date()),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    staffId: staff[0]?.id || null,
    color: COLORS[0]
  });
  
  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: '',
        date: formatDate(new Date()),
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        description: '',
        staffId: staff[0]?.id || null,
        color: COLORS[0]
      });
    }
  }, [event, staff]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Add Event'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="Event title"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={e => setFormData({...formData, startTime: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={e => setFormData({...formData, endTime: e.target.value})}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            placeholder="Location"
          />
        </div>
        
        <div className="form-group">
          <label>Assign To</label>
          <select
            value={formData.staffId || ''}
            onChange={e => {
              const staffMember = staff.find(s => s.id === Number(e.target.value));
              setFormData({
                ...formData, 
                staffId: Number(e.target.value),
                color: staffMember?.color || formData.color
              });
            }}
          >
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Event description..."
            rows={3}
          />
        </div>
        
        <ColorPicker 
          selectedColor={formData.color} 
          onSelect={color => setFormData({...formData, color})} 
        />
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">
            {event ? 'Save Changes' : 'Add Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Add/Edit Task Modal
const TaskModal = ({ isOpen, onClose, onSave, task, staff }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: formatDate(new Date()),
    assignedTo: null,
    status: 'pending',
    priority: 'medium'
  });
  
  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: formatDate(new Date()),
        assignedTo: null,
        status: 'pending',
        priority: 'medium'
      });
    }
  }, [task]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Add Task'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="Task title"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Task description..."
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={e => setFormData({...formData, dueDate: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Assign To</label>
          <select
            value={formData.assignedTo || ''}
            onChange={e => setFormData({...formData, assignedTo: e.target.value ? Number(e.target.value) : null})}
          >
            <option value="">Unassigned</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={e => setFormData({...formData, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">
            {task ? 'Save Changes' : 'Save Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Add/Edit Staff Modal
const StaffModal = ({ isOpen, onClose, onSave, staffMember }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    color: COLORS[0]
  });
  
  useEffect(() => {
    if (staffMember) {
      setFormData(staffMember);
    } else {
      setFormData({
        name: '',
        email: '',
        position: '',
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }, [staffMember]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={staffMember ? 'Edit Staff Member' : 'Add Staff Member'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="john@example.com"
          />
        </div>
        
        <div className="form-group">
          <label>Position</label>
          <input
            type="text"
            value={formData.position}
            onChange={e => setFormData({...formData, position: e.target.value})}
            placeholder="Coach"
          />
        </div>
        
        <ColorPicker 
          selectedColor={formData.color} 
          onSelect={color => setFormData({...formData, color})} 
        />
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">
            {staffMember ? 'Save Changes' : 'Add Staff'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Daily View Component
const DailyView = ({ date, events, tasks, staff, onAddEvent, onAddTask, onEditEvent, onDeleteEvent, onNavigate, onToday }) => {
  const dateStr = formatDate(date);
  const dayEvents = events.filter(e => e.date === dateStr);
  const dayTasks = tasks.filter(t => t.dueDate === dateStr);
  
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const isToday = formatDate(new Date()) === dateStr;
  
  return (
    <div className="daily-view">
      <div className="view-header">
        <h2>Daily Plan</h2>
        <div className="date-nav-container">
          <button className="btn-today" onClick={onToday} disabled={isToday}>Today</button>
          <div className="date-navigation">
            <button onClick={() => onNavigate(-1)}><ChevronLeft /></button>
            <span className="current-date">{formattedDate}</span>
            <button onClick={() => onNavigate(1)}><ChevronRight /></button>
          </div>
        </div>
      </div>
      
      <div className="daily-content">
        <div className="events-section">
          <div className="section-header">
            <h3>Events</h3>
            <button className="btn-primary" onClick={onAddEvent}>
              <PlusIcon /> Add Event
            </button>
          </div>
          
          {dayEvents.length === 0 ? (
            <p className="empty-state">No events scheduled</p>
          ) : (
            <div className="events-list">
              {dayEvents.map(event => {
                const staffMember = staff.find(s => s.id === event.staffId);
                return (
                  <div key={event.id} className="event-card" style={{ borderLeftColor: event.color }}>
                    <div className="event-time">{event.startTime} - {event.endTime}</div>
                    <div className="event-title">{event.title}</div>
                    {event.location && <div className="event-location">{event.location}</div>}
                    {staffMember && (
                      <div className="event-staff">
                        <span className="staff-dot" style={{ backgroundColor: staffMember.color }} />
                        {staffMember.name}
                      </div>
                    )}
                    <div className="event-actions">
                      <button onClick={() => onEditEvent(event)}><EditIcon /></button>
                      <button onClick={() => onDeleteEvent(event.id)}><TrashIcon /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="tasks-section">
          <div className="section-header">
            <h3>Tasks</h3>
            <button className="btn-primary" onClick={onAddTask}>
              <PlusIcon /> Add Task
            </button>
          </div>
          
          {dayTasks.length === 0 ? (
            <p className="empty-state">No tasks</p>
          ) : (
            <div className="tasks-list">
              {dayTasks.map(task => {
                const staffMember = staff.find(s => s.id === task.assignedTo);
                return (
                  <div key={task.id} className={`task-card priority-${task.priority}`}>
                    <div className="task-checkbox">
                      <input type="checkbox" checked={task.status === 'completed'} readOnly />
                    </div>
                    <div className="task-content">
                      <div className="task-title">{task.title}</div>
                      {task.description && <div className="task-description">{task.description}</div>}
                      {staffMember && <div className="task-assignee">{staffMember.name}</div>}
                    </div>
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Weekly View Component
const WeeklyView = ({ date, events, staff, onDateClick, onNavigate, onToday }) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }
  
  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    return `${MONTHS[start.getMonth()].slice(0, 3)} ${start.getDate()} - ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getDate()}`;
  };

  // Check if current week contains today
  const today = new Date();
  const todayStr = formatDate(today);
  const isCurrentWeek = weekDays.some(d => formatDate(d) === todayStr);
  
  return (
    <div className="weekly-view">
      <div className="view-header">
        <h2>Weekly Plan</h2>
        <div className="date-nav-container">
          <button className="btn-today" onClick={onToday} disabled={isCurrentWeek}>This Week</button>
          <div className="date-navigation">
            <button onClick={() => onNavigate(-1)}><ChevronLeft /></button>
            <span className="week-range">{formatWeekRange()}</span>
            <button onClick={() => onNavigate(1)}><ChevronRight /></button>
          </div>
        </div>
      </div>
      
      <div className="week-grid">
        {weekDays.map((d, i) => {
          const dateStr = formatDate(d);
          const dayEvents = events.filter(e => e.date === dateStr);
          const isToday = formatDate(new Date()) === dateStr;
          
          return (
            <div 
              key={i} 
              className={`week-day ${isToday ? 'today' : ''}`}
              onClick={() => onDateClick(d)}
            >
              <div className="week-day-header">
                <span className="day-name">{DAYS[d.getDay()]}</span>
                <span className="day-number">{d.getDate()}</span>
              </div>
              <div className="week-day-events">
                {dayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="week-event"
                    style={{ backgroundColor: `${event.color}20`, borderLeft: `3px solid ${event.color}` }}
                  >
                    <span className="event-time-small">{event.startTime}</span>
                    <span className="event-title-small">{event.title}</span>
                  </div>
                ))}
              </div>
              <div className="event-count">{dayEvents.length > 0 && `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Staff Calendar View Component
const StaffCalendarView = ({ 
  year, 
  staff, 
  events, 
  selectedStaffId, 
  onSelectStaff, 
  onAddStaff, 
  onEditStaff, 
  onDeleteStaff,
  onDateClick,
  onYearChange
}) => {
  const selectedStaff = selectedStaffId === 'all' 
    ? null 
    : staff.find(s => s.id === selectedStaffId);
  
  return (
    <div className="staff-calendar-view">
      <div className="staff-sidebar">
        <div className="staff-header">
          <UsersIcon />
          <span>Staff Members</span>
          <button className="btn-add-staff" onClick={onAddStaff}>
            <PlusIcon /> Add Staff
          </button>
        </div>
        
        <div className="staff-list">
          {/* All Staff Option */}
          <div 
            className={`staff-item ${selectedStaffId === 'all' ? 'selected' : ''}`}
            onClick={() => onSelectStaff('all')}
          >
            <div className="staff-avatar all-staff">
              <UsersIcon />
            </div>
            <div className="staff-info">
              <span className="staff-name">All Staff</span>
              <span className="staff-position">Combined View</span>
            </div>
          </div>
          
          {staff.map(s => (
            <div 
              key={s.id} 
              className={`staff-item ${selectedStaffId === s.id ? 'selected' : ''}`}
              onClick={() => onSelectStaff(s.id)}
            >
              <div className="staff-avatar" style={{ backgroundColor: s.color }}>
                {s.name.charAt(0)}
              </div>
              <div className="staff-info">
                <span className="staff-name">{s.name}</span>
                <span className="staff-position">{s.position}</span>
              </div>
              <div className="staff-actions">
                <button onClick={(e) => { e.stopPropagation(); onEditStaff(s); }}>
                  <EditIcon />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDeleteStaff(s.id); }}>
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="calendar-main">
        <div className="calendar-header">
          <h2>{year} Calendar</h2>
          {selectedStaff && (
            <span className="viewing-staff" style={{ color: selectedStaff.color }}>
              - {selectedStaff.name}
            </span>
          )}
          {selectedStaffId === 'all' && (
            <span className="viewing-staff viewing-all">- All Staff</span>
          )}
          <div className="year-nav">
            <button onClick={() => onYearChange(year - 1)}><ChevronLeft /></button>
            <span>{year}</span>
            <button onClick={() => onYearChange(year + 1)}><ChevronRight /></button>
          </div>
        </div>
        
        {selectedStaffId === 'all' && (
          <div className="staff-legend">
            {staff.map(s => (
              <div key={s.id} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: s.color }} />
                <span className="legend-name">{s.name}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="year-grid">
          {MONTHS.map((_, month) => (
            <MiniCalendar
              key={month}
              year={year}
              month={month}
              events={events}
              selectedStaffId={selectedStaffId}
              staff={staff}
              onDateClick={onDateClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [activeView, setActiveView] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [staff, setStaff] = useState(initialStaff);
  const [events, setEvents] = useState(initialEvents);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedStaffId, setSelectedStaffId] = useState('all');
  
  // Modal states
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  
  // Event handlers
  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...eventData, id: e.id } : e));
    } else {
      setEvents([...events, { ...eventData, id: Date.now() }]);
    }
    setEditingEvent(null);
  };
  
  const handleDeleteEvent = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };
  
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: t.id } : t));
    } else {
      setTasks([...tasks, { ...taskData, id: Date.now() }]);
    }
    setEditingTask(null);
  };
  
  const handleSaveStaff = (staffData) => {
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...staffData, id: s.id } : s));
      // Update events for this staff member
      setEvents(events.map(e => e.staffId === editingStaff.id ? { ...e, color: staffData.color } : e));
    } else {
      setStaff([...staff, { ...staffData, id: Date.now() }]);
    }
    setEditingStaff(null);
  };
  
  const handleDeleteStaff = (id) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.id !== id));
      if (selectedStaffId === id) setSelectedStaffId('all');
    }
  };
  
  const handleDateClick = (dateStr) => {
    setCurrentDate(parseDate(dateStr));
    setActiveView('daily');
  };
  
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (activeView === 'daily') {
      newDate.setDate(newDate.getDate() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <CalendarIcon />
          <h1>Planning Hub</h1>
        </div>
        
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeView === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveView('daily')}
          >
            <ClockIcon /> Daily
          </button>
          <button 
            className={`nav-tab ${activeView === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveView('weekly')}
          >
            <ChartIcon /> Weekly
          </button>
          <button 
            className={`nav-tab ${activeView === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveView('staff')}
          >
            <CalendarIcon /> Staff Calendar
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {activeView === 'daily' && (
          <DailyView
            date={currentDate}
            events={events}
            tasks={tasks}
            staff={staff}
            onAddEvent={() => { setEditingEvent(null); setEventModalOpen(true); }}
            onAddTask={() => { setEditingTask(null); setTaskModalOpen(true); }}
            onEditEvent={(event) => { setEditingEvent(event); setEventModalOpen(true); }}
            onDeleteEvent={handleDeleteEvent}
            onNavigate={navigateDate}
            onToday={goToToday}
          />
        )}
        
        {activeView === 'weekly' && (
          <WeeklyView
            date={currentDate}
            events={events}
            staff={staff}
            onDateClick={(d) => { setCurrentDate(d); setActiveView('daily'); }}
            onNavigate={navigateDate}
            onToday={goToToday}
          />
        )}
        
        {activeView === 'staff' && (
          <StaffCalendarView
            year={currentYear}
            staff={staff}
            events={events}
            selectedStaffId={selectedStaffId}
            onSelectStaff={setSelectedStaffId}
            onAddStaff={() => { setEditingStaff(null); setStaffModalOpen(true); }}
            onEditStaff={(s) => { setEditingStaff(s); setStaffModalOpen(true); }}
            onDeleteStaff={handleDeleteStaff}
            onDateClick={handleDateClick}
            onYearChange={setCurrentYear}
          />
        )}
      </main>
      
      <EventModal
        isOpen={eventModalOpen}
        onClose={() => { setEventModalOpen(false); setEditingEvent(null); }}
        onSave={handleSaveEvent}
        event={editingEvent}
        staff={staff}
      />
      
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        staff={staff}
      />
      
      <StaffModal
        isOpen={staffModalOpen}
        onClose={() => { setStaffModalOpen(false); setEditingStaff(null); }}
        onSave={handleSaveStaff}
        staffMember={editingStaff}
      />
    </div>
  );
}

export default App;
