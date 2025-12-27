import React, { useState, useEffect, useCallback } from 'react';
import { saveData, subscribeToData } from './firebase';
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

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
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

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const CloudIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>
);

// Color palette
const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#22C55E',
];

// Helper functions
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const formatDate = (date) => date.toISOString().split('T')[0];

const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const isDateInEventRange = (dateStr, event) => {
  const date = parseDate(dateStr);
  const startDate = parseDate(event.startDate || event.date);
  const endDate = parseDate(event.endDate || event.startDate || event.date);
  return date >= startDate && date <= endDate;
};

const getEventDuration = (event) => {
  const startDate = parseDate(event.startDate || event.date);
  const endDate = parseDate(event.endDate || event.startDate || event.date);
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const getStaffNames = (event, staff) => {
  const staffIds = event.staffIds || (event.staffId ? [event.staffId] : []);
  return staffIds.map(id => staff.find(s => s.id === id)?.name).filter(Boolean);
};

const getEventColor = (event, staff) => {
  const staffIds = event.staffIds || (event.staffId ? [event.staffId] : []);
  if (staffIds.length > 0) {
    const firstStaff = staff.find(s => s.id === staffIds[0]);
    return firstStaff?.color || event.color || COLORS[0];
  }
  return event.color || COLORS[0];
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Default data
const defaultStaff = [
  { id: 1, name: 'Karen McElroy', email: 'karen@example.com', position: 'Manager', color: '#3B82F6' },
  { id: 2, name: 'Nathan McElroy', email: 'nathan@example.com', position: 'Coach', color: '#10B981' },
  { id: 3, name: 'Ruby Lewis', email: 'ruby@example.com', position: 'Coach', color: '#EC4899' },
];

const defaultEvents = [];
const defaultTasks = [];

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'normal' }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${size === 'small' ? 'modal-small' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}><CloseIcon /></button>
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
        <button key={color} className={`color-option ${selectedColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }} onClick={() => onSelect(color)} />
      ))}
    </div>
  </div>
);

// Multi-select Staff Picker
const StaffPicker = ({ staff, selectedIds, onChange }) => {
  const toggleStaff = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };
  
  return (
    <div className="staff-picker">
      <label>Assign To</label>
      <div className="staff-picker-list">
        {staff.map(s => (
          <label key={s.id} className={`staff-picker-item ${selectedIds.includes(s.id) ? 'selected' : ''}`}>
            <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleStaff(s.id)} />
            <span className="staff-picker-avatar" style={{ backgroundColor: s.color }}>{s.name.charAt(0)}</span>
            <span className="staff-picker-name">{s.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Day Popup Component
const DayPopup = ({ isOpen, onClose, dateStr, events, staff, onAddEvent, onEditEvent, onDeleteEvent }) => {
  if (!isOpen || !dateStr) return null;
  
  const date = parseDate(dateStr);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dayEvents = events.filter(e => isDateInEventRange(dateStr, e));
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formattedDate} size="small">
      <div className="day-popup-content">
        {dayEvents.length === 0 ? (
          <p className="empty-state">No events on this day</p>
        ) : (
          <div className="day-popup-events">
            {dayEvents.map(event => {
              const staffNames = getStaffNames(event, staff);
              const color = getEventColor(event, staff);
              const duration = getEventDuration(event);
              return (
                <div key={event.id} className="day-popup-event" style={{ borderLeftColor: color }}>
                  <div className="day-popup-event-header">
                    <span className="day-popup-event-title">{event.title}</span>
                    <div className="day-popup-event-actions">
                      <button onClick={() => { onClose(); onEditEvent(event); }}><EditIcon /></button>
                      <button onClick={() => onDeleteEvent(event.id)}><TrashIcon /></button>
                    </div>
                  </div>
                  {event.isAllDay ? <span className="day-popup-time all-day">All Day</span> : <span className="day-popup-time">{event.startTime} - {event.endTime}</span>}
                  {duration > 1 && <span className="day-popup-duration">{duration} days</span>}
                  {event.location && <span className="day-popup-location">{event.location}</span>}
                  {staffNames.length > 0 && <span className="day-popup-staff">{staffNames.join(', ')}</span>}
                </div>
              );
            })}
          </div>
        )}
        <button className="btn-primary day-popup-add" onClick={() => { onClose(); onAddEvent(dateStr); }}><PlusIcon /> Add Event</button>
      </div>
    </Modal>
  );
};

// Mini Calendar for Year View
const MiniCalendar = ({ year, month, events, selectedStaffId, staff, onDateClick }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const monthlyEvents = events.filter(e => e.showInMonthlyYearly !== false);
  
  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthlyEvents.filter(e => {
      if (!isDateInEventRange(dateStr, e)) return false;
      if (selectedStaffId === 'all') return true;
      const staffIds = e.staffIds || (e.staffId ? [e.staffId] : []);
      return staffIds.includes(selectedStaffId);
    });
  };
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="mini-day empty" />);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    const dayEvents = getEventsForDay(day);
    const hasEvents = dayEvents.length > 0;
    
    days.push(
      <div key={day} className={`mini-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`} onClick={() => onDateClick(dateStr)} title={hasEvents ? dayEvents.map(e => e.title).join(', ') : ''}>
        <div className="mini-day-events">
          {dayEvents.slice(0, 2).map((e, i) => <div key={i} className="mini-event-bar" style={{ backgroundColor: getEventColor(e, staff) }} title={e.title} />)}
        </div>
        <span className="mini-day-number">{day}</span>
      </div>
    );
  }
  
  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">{MONTHS[month]}</div>
      <div className="mini-calendar-days-header">{DAYS_SHORT.map((d, i) => <div key={i} className="day-header">{d}</div>)}</div>
      <div className="mini-calendar-grid">{days}</div>
    </div>
  );
};

// Event Modal
const EventModal = ({ isOpen, onClose, onSave, event, staff, initialDate }) => {
  const [formData, setFormData] = useState({
    title: '', startDate: formatDate(new Date()), endDate: formatDate(new Date()),
    startTime: '09:00', endTime: '10:00', location: '', description: '',
    staffIds: [], color: COLORS[0], isAllDay: false,
    showInDailyWeekly: true, showInMonthlyYearly: true
  });
  
  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        startDate: event.startDate || formatDate(new Date()),
        endDate: event.endDate || event.startDate || formatDate(new Date()),
        staffIds: event.staffIds || (event.staffId ? [event.staffId] : []),
        showInDailyWeekly: event.showInDailyWeekly !== false,
        showInMonthlyYearly: event.showInMonthlyYearly !== false
      });
    } else {
      const dateToUse = initialDate || formatDate(new Date());
      setFormData({
        title: '', startDate: dateToUse, endDate: dateToUse,
        startTime: '09:00', endTime: '10:00', location: '', description: '',
        staffIds: [], color: COLORS[0], isAllDay: false,
        showInDailyWeekly: true, showInMonthlyYearly: true
      });
    }
  }, [event, staff, initialDate]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    let endDate = formData.endDate;
    if (parseDate(endDate) < parseDate(formData.startDate)) endDate = formData.startDate;
    let color = formData.color;
    if (formData.staffIds.length > 0) {
      const firstStaff = staff.find(s => s.id === formData.staffIds[0]);
      if (firstStaff) color = firstStaff.color;
    }
    onSave({ ...formData, endDate, color });
    onClose();
  };

  const duration = getEventDuration({ startDate: formData.startDate, endDate: formData.endDate });
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Add Event'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Event Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Event title" required />
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={formData.isAllDay} onChange={e => setFormData({...formData, isAllDay: e.target.checked})} />
            All day / Multi-day event
          </label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} min={formData.startDate} required />
          </div>
        </div>
        {duration > 1 && <div className="duration-badge">{duration} days</div>}
        {!formData.isAllDay && (
          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>
        )}
        <div className="form-group">
          <label>Location</label>
          <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Location" />
        </div>
        <StaffPicker staff={staff} selectedIds={formData.staffIds} onChange={ids => setFormData({...formData, staffIds: ids})} />
        <div className="form-group">
          <label>Show In</label>
          <div className="visibility-options">
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.showInDailyWeekly} onChange={e => setFormData({...formData, showInDailyWeekly: e.target.checked})} />
              Daily & Weekly
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.showInMonthlyYearly} onChange={e => setFormData({...formData, showInMonthlyYearly: e.target.checked})} />
              Monthly & Yearly
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Event description..." rows={3} />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{event ? 'Save Changes' : 'Add Event'}</button>
        </div>
      </form>
    </Modal>
  );
};

// Task Modal
const TaskModal = ({ isOpen, onClose, onSave, task, staff }) => {
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: formatDate(new Date()), assignedTo: null, status: 'pending', priority: 'medium' });
  
  useEffect(() => {
    if (task) setFormData(task);
    else setFormData({ title: '', description: '', dueDate: formatDate(new Date()), assignedTo: null, status: 'pending', priority: 'medium' });
  }, [task]);
  
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); onClose(); };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Add Task'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Task Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Task title" required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Task description..." rows={3} />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Assign To</label>
          <select value={formData.assignedTo || ''} onChange={e => setFormData({...formData, assignedTo: e.target.value ? Number(e.target.value) : null})}>
            <option value="">Unassigned</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{task ? 'Save Changes' : 'Save Task'}</button>
        </div>
      </form>
    </Modal>
  );
};

// Staff Modal
const StaffModal = ({ isOpen, onClose, onSave, staffMember }) => {
  const [formData, setFormData] = useState({ name: '', email: '', position: '', color: COLORS[0] });
  
  useEffect(() => {
    if (staffMember) setFormData(staffMember);
    else setFormData({ name: '', email: '', position: '', color: COLORS[Math.floor(Math.random() * COLORS.length)] });
  }, [staffMember]);
  
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); onClose(); };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={staffMember ? 'Edit Staff Member' : 'Add Staff Member'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label>Position</label>
          <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} placeholder="Coach" />
        </div>
        <ColorPicker selectedColor={formData.color} onSelect={color => setFormData({...formData, color})} />
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{staffMember ? 'Save Changes' : 'Add Staff'}</button>
        </div>
      </form>
    </Modal>
  );
};

// Daily View
const DailyView = ({ date, events, tasks, staff, onAddEvent, onAddTask, onEditEvent, onDeleteEvent, onToggleTask, onNavigate, onToday }) => {
  const dateStr = formatDate(date);
  const dailyEvents = events.filter(e => e.showInDailyWeekly !== false);
  const dayEvents = dailyEvents.filter(e => isDateInEventRange(dateStr, e));
  const pendingTasks = tasks.filter(t => t.dueDate === dateStr && t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed').sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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
            <button className="btn-primary" onClick={onAddEvent}><PlusIcon /> Add Event</button>
          </div>
          {dayEvents.length === 0 ? <p className="empty-state">No events scheduled</p> : (
            <div className="events-list">
              {dayEvents.map(event => {
                const staffNames = getStaffNames(event, staff);
                const color = getEventColor(event, staff);
                const duration = getEventDuration(event);
                return (
                  <div key={event.id} className={`event-card ${duration > 1 ? 'multi-day' : ''}`} style={{ borderLeftColor: color }}>
                    {event.isAllDay ? <div className="event-time all-day">All Day</div> : <div className="event-time">{event.startTime} - {event.endTime}</div>}
                    <div className="event-title">{event.title}</div>
                    {duration > 1 && <div className="event-duration">{duration} days ({event.startDate} to {event.endDate})</div>}
                    {event.location && <div className="event-location">{event.location}</div>}
                    {staffNames.length > 0 && <div className="event-staff">{staffNames.join(', ')}</div>}
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
            <button className="btn-primary" onClick={onAddTask}><PlusIcon /> Add Task</button>
          </div>
          {pendingTasks.length === 0 ? <p className="empty-state">No tasks due</p> : (
            <div className="tasks-list">
              {pendingTasks.map(task => {
                const staffMember = staff.find(s => s.id === task.assignedTo);
                return (
                  <div key={task.id} className={`task-card priority-${task.priority}`}>
                    <div className="task-checkbox"><input type="checkbox" checked={task.status === 'completed'} onChange={() => onToggleTask(task.id)} /></div>
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
      {completedTasks.length > 0 && (
        <div className="completed-section">
          <div className="section-header"><h3><CheckIcon /> Completed Tasks</h3></div>
          <div className="completed-list">
            {completedTasks.slice(0, 10).map(task => {
              const staffMember = staff.find(s => s.id === task.assignedTo);
              const completedDate = task.completedAt ? new Date(task.completedAt) : null;
              return (
                <div key={task.id} className="completed-task">
                  <div className="completed-check"><CheckIcon /></div>
                  <div className="completed-info">
                    <span className="completed-title">{task.title}</span>
                    {staffMember && <span className="completed-assignee">{staffMember.name}</span>}
                  </div>
                  {completedDate && <div className="completed-time">{completedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {completedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Weekly View
const WeeklyView = ({ date, events, staff, onDateClick, onNavigate, onToday, onAddEvent }) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const daysToSubtract = day === 0 ? 6 : day - 1;
  startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }
  
  const weeklyEvents = events.filter(e => e.showInDailyWeekly !== false);
  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    return `${MONTHS[start.getMonth()].slice(0, 3)} ${start.getDate()} - ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getDate()}`;
  };
  const today = new Date();
  const todayStr = formatDate(today);
  const isCurrentWeek = weekDays.some(d => formatDate(d) === todayStr);
  
  return (
    <div className="weekly-view">
      <div className="view-header">
        <h2>Weekly Plan</h2>
        <button className="btn-primary" onClick={() => onAddEvent()}><PlusIcon /> Add Event</button>
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
          const dayEvents = weeklyEvents.filter(e => isDateInEventRange(dateStr, e));
          const isToday = formatDate(new Date()) === dateStr;
          return (
            <div key={i} className={`week-day ${isToday ? 'today' : ''}`} onClick={() => onDateClick(d)}>
              <div className="week-day-header">
                <span className="day-name">{DAYS[i]}</span>
                <span className="day-number">{d.getDate()}</span>
              </div>
              <div className="week-day-events">
                {dayEvents.map(event => {
                  const color = getEventColor(event, staff);
                  return (
                    <div key={event.id} className={`week-event ${event.isAllDay ? 'all-day' : ''}`} style={{ backgroundColor: `${color}20`, borderLeft: `3px solid ${color}` }}>
                      {!event.isAllDay && <span className="event-time-small">{event.startTime}</span>}
                      <span className="event-title-small">{event.title}</span>
                    </div>
                  );
                })}
              </div>
              <div className="event-count">{dayEvents.length > 0 && `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Monthly View
const MonthlyView = ({ date, events, staff, onDateClick, onNavigate, onToday, onAddEvent }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const monthlyEvents = events.filter(e => e.showInMonthlyYearly !== false);
  
  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthlyEvents.filter(e => isDateInEventRange(dateStr, e));
  };
  
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="month-day empty" />);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    const dayEvents = getEventsForDay(day);
    
    days.push(
      <div key={day} className={`month-day ${isToday ? 'today' : ''}`} onClick={() => onDateClick(dateStr)}>
        <div className="month-day-number">{day}</div>
        <div className="month-day-events">
          {dayEvents.slice(0, 3).map((event) => {
            const staffNames = getStaffNames(event, staff);
            const color = getEventColor(event, staff);
            return (
              <div key={event.id} className="month-event-bar" style={{ backgroundColor: color }} title={`${event.title} - ${staffNames.join(', ')}`}>
                <span className="month-event-title">{event.title}</span>
                {staffNames.length > 0 && <span className="month-event-staff">- {staffNames[0]}{staffNames.length > 1 ? ` +${staffNames.length - 1}` : ''}</span>}
              </div>
            );
          })}
          {dayEvents.length > 3 && <div className="month-event-more">+{dayEvents.length - 3} more</div>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="monthly-view">
      <div className="view-header">
        <h2>Monthly View</h2>
        <button className="btn-primary" onClick={() => onAddEvent()}><PlusIcon /> Add Event</button>
        <div className="date-nav-container">
          <button className="btn-today" onClick={onToday} disabled={isCurrentMonth}>This Month</button>
          <div className="date-navigation">
            <button onClick={() => onNavigate(-1)}><ChevronLeft /></button>
            <span className="month-year">{MONTHS[month]} {year}</span>
            <button onClick={() => onNavigate(1)}><ChevronRight /></button>
          </div>
        </div>
      </div>
      <div className="month-grid-header">{DAYS.map((d, i) => <div key={i} className="month-header-day">{d}</div>)}</div>
      <div className="month-grid">{days}</div>
    </div>
  );
};

// Staff Calendar View
const StaffCalendarView = ({ year, staff, events, selectedStaffId, onSelectStaff, onAddStaff, onEditStaff, onDeleteStaff, onDateClick, onYearChange, onAddEvent }) => {
  const selectedStaff = selectedStaffId === 'all' ? null : staff.find(s => s.id === selectedStaffId);
  
  return (
    <div className="staff-calendar-view">
      <div className="staff-sidebar">
        <div className="staff-header">
          <UsersIcon /><span>Staff Members</span>
          <button className="btn-add-staff" onClick={onAddStaff}><PlusIcon /> Add Staff</button>
        </div>
        <div className="staff-list">
          <div className={`staff-item ${selectedStaffId === 'all' ? 'selected' : ''}`} onClick={() => onSelectStaff('all')}>
            <div className="staff-avatar all-staff"><UsersIcon /></div>
            <div className="staff-info"><span className="staff-name">All Staff</span><span className="staff-position">Combined View</span></div>
          </div>
          {staff.map(s => (
            <div key={s.id} className={`staff-item ${selectedStaffId === s.id ? 'selected' : ''}`} onClick={() => onSelectStaff(s.id)}>
              <div className="staff-avatar" style={{ backgroundColor: s.color }}>{s.name.charAt(0)}</div>
              <div className="staff-info"><span className="staff-name">{s.name}</span><span className="staff-position">{s.position}</span></div>
              <div className="staff-actions">
                <button onClick={(e) => { e.stopPropagation(); onEditStaff(s); }}><EditIcon /></button>
                <button onClick={(e) => { e.stopPropagation(); onDeleteStaff(s.id); }}><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-main">
        <div className="calendar-header">
          <h2>{year} Calendar</h2>
          {selectedStaff && <span className="viewing-staff" style={{ color: selectedStaff.color }}>- {selectedStaff.name}</span>}
          {selectedStaffId === 'all' && <span className="viewing-staff viewing-all">- All Staff</span>}
          <button className="btn-primary btn-add-event-calendar" onClick={() => onAddEvent()}><PlusIcon /> Add Event</button>
          <div className="year-nav">
            <button onClick={() => onYearChange(year - 1)}><ChevronLeft /></button>
            <span>{year}</span>
            <button onClick={() => onYearChange(year + 1)}><ChevronRight /></button>
          </div>
        </div>
        {selectedStaffId === 'all' && (
          <div className="staff-legend">{staff.map(s => <div key={s.id} className="legend-item"><span className="legend-color" style={{ backgroundColor: s.color }} /><span className="legend-name">{s.name}</span></div>)}</div>
        )}
        <div className="year-grid">{MONTHS.map((_, month) => <MiniCalendar key={month} year={year} month={month} events={events} selectedStaffId={selectedStaffId} staff={staff} onDateClick={onDateClick} />)}</div>
      </div>
    </div>
  );
};

// Main App
function App() {
  const [activeView, setActiveView] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [staff, setStaff] = useState(defaultStaff);
  const [events, setEvents] = useState(defaultEvents);
  const [tasks, setTasks] = useState(defaultTasks);
  const [selectedStaffId, setSelectedStaffId] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState('connecting');
  
  // Modal states
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [eventInitialDate, setEventInitialDate] = useState(null);
  const [dayPopupOpen, setDayPopupOpen] = useState(false);
  const [dayPopupDate, setDayPopupDate] = useState(null);
  
  // Save to Firebase
  const saveToFirebase = useCallback((data) => {
    setSyncStatus('saving');
    saveData(data).then(() => {
      setSyncStatus('synced');
    }).catch((error) => {
      console.error('Save error:', error);
      setSyncStatus('error');
    });
  }, []);
  
  // Load data from Firebase on mount
  useEffect(() => {
    const unsubscribe = subscribeToData((data) => {
      if (data) {
        // Migrate old staffId to staffIds
        const migratedEvents = (data.events || []).map(e => ({
          ...e,
          staffIds: e.staffIds || (e.staffId ? [e.staffId] : [])
        }));
        setStaff(data.staff || defaultStaff);
        setEvents(migratedEvents);
        setTasks(data.tasks || defaultTasks);
      }
      setIsLoaded(true);
      setSyncStatus('synced');
    });
    
    return () => unsubscribe();
  }, []);
  
  // Event handlers with Firebase save
  const handleSaveEvent = (eventData) => {
    let newEvents;
    if (editingEvent) {
      newEvents = events.map(e => e.id === editingEvent.id ? { ...eventData, id: e.id } : e);
    } else {
      newEvents = [...events, { ...eventData, id: Date.now() }];
    }
    setEvents(newEvents);
    saveToFirebase({ staff, events: newEvents, tasks });
    setEditingEvent(null);
    setEventInitialDate(null);
  };
  
  const handleDeleteEvent = (id) => {
    if (confirm('Delete this event?')) {
      const newEvents = events.filter(e => e.id !== id);
      setEvents(newEvents);
      saveToFirebase({ staff, events: newEvents, tasks });
    }
  };
  
  const handleSaveTask = (taskData) => {
    let newTasks;
    if (editingTask) {
      newTasks = tasks.map(t => t.id === editingTask.id ? { ...taskData, id: t.id } : t);
    } else {
      newTasks = [...tasks, { ...taskData, id: Date.now(), completedAt: null }];
    }
    setTasks(newTasks);
    saveToFirebase({ staff, events, tasks: newTasks });
    setEditingTask(null);
  };

  const handleToggleTask = (id) => {
    const newTasks = tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : null };
      }
      return t;
    });
    setTasks(newTasks);
    saveToFirebase({ staff, events, tasks: newTasks });
  };
  
  const handleSaveStaff = (staffData) => {
    let newStaff;
    if (editingStaff) {
      newStaff = staff.map(s => s.id === editingStaff.id ? { ...staffData, id: s.id } : s);
    } else {
      newStaff = [...staff, { ...staffData, id: Date.now() }];
    }
    setStaff(newStaff);
    saveToFirebase({ staff: newStaff, events, tasks });
    setEditingStaff(null);
  };
  
  const handleDeleteStaff = (id) => {
    if (confirm('Delete this staff member?')) {
      const newStaff = staff.filter(s => s.id !== id);
      setStaff(newStaff);
      if (selectedStaffId === id) setSelectedStaffId('all');
      saveToFirebase({ staff: newStaff, events, tasks });
    }
  };
  
  const handleDayClick = (dateStr) => { setDayPopupDate(dateStr); setDayPopupOpen(true); };
  
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (activeView === 'daily') newDate.setDate(newDate.getDate() + direction);
    else if (activeView === 'weekly') newDate.setDate(newDate.getDate() + (direction * 7));
    else if (activeView === 'monthly') newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());
  const openAddEvent = (initialDate = null) => { setEditingEvent(null); setEventInitialDate(initialDate || formatDate(currentDate)); setEventModalOpen(true); };
  
  if (!isLoaded) return <div className="loading">Loading...</div>;
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo"><CalendarIcon /><h1>Planning Hub</h1></div>
        <nav className="nav-tabs">
          <button className={`nav-tab ${activeView === 'daily' ? 'active' : ''}`} onClick={() => setActiveView('daily')}><ClockIcon /> Daily</button>
          <button className={`nav-tab ${activeView === 'weekly' ? 'active' : ''}`} onClick={() => setActiveView('weekly')}><ChartIcon /> Weekly</button>
          <button className={`nav-tab ${activeView === 'monthly' ? 'active' : ''}`} onClick={() => setActiveView('monthly')}><GridIcon /> Monthly</button>
          <button className={`nav-tab ${activeView === 'staff' ? 'active' : ''}`} onClick={() => setActiveView('staff')}><CalendarIcon /> Staff Calendar</button>
        </nav>
        <div className={`sync-status ${syncStatus}`}>
          <CloudIcon />
          <span>{syncStatus === 'synced' ? 'Synced' : syncStatus === 'saving' ? 'Saving...' : syncStatus === 'connecting' ? 'Connecting...' : 'Error'}</span>
        </div>
      </header>
      
      <main className="app-main">
        {activeView === 'daily' && <DailyView date={currentDate} events={events} tasks={tasks} staff={staff} onAddEvent={() => openAddEvent(formatDate(currentDate))} onAddTask={() => { setEditingTask(null); setTaskModalOpen(true); }} onEditEvent={(e) => { setEditingEvent(e); setEventModalOpen(true); }} onDeleteEvent={handleDeleteEvent} onToggleTask={handleToggleTask} onNavigate={navigateDate} onToday={goToToday} />}
        {activeView === 'weekly' && <WeeklyView date={currentDate} events={events} staff={staff} onDateClick={(d) => { setCurrentDate(d); setActiveView('daily'); }} onNavigate={navigateDate} onToday={goToToday} onAddEvent={openAddEvent} />}
        {activeView === 'monthly' && <MonthlyView date={currentDate} events={events} staff={staff} onDateClick={handleDayClick} onNavigate={navigateDate} onToday={goToToday} onAddEvent={openAddEvent} />}
        {activeView === 'staff' && <StaffCalendarView year={currentYear} staff={staff} events={events} selectedStaffId={selectedStaffId} onSelectStaff={setSelectedStaffId} onAddStaff={() => { setEditingStaff(null); setStaffModalOpen(true); }} onEditStaff={(s) => { setEditingStaff(s); setStaffModalOpen(true); }} onDeleteStaff={handleDeleteStaff} onDateClick={handleDayClick} onYearChange={setCurrentYear} onAddEvent={openAddEvent} />}
      </main>
      
      <EventModal isOpen={eventModalOpen} onClose={() => { setEventModalOpen(false); setEditingEvent(null); setEventInitialDate(null); }} onSave={handleSaveEvent} event={editingEvent} staff={staff} initialDate={eventInitialDate} />
      <TaskModal isOpen={taskModalOpen} onClose={() => { setTaskModalOpen(false); setEditingTask(null); }} onSave={handleSaveTask} task={editingTask} staff={staff} />
      <StaffModal isOpen={staffModalOpen} onClose={() => { setStaffModalOpen(false); setEditingStaff(null); }} onSave={handleSaveStaff} staffMember={editingStaff} />
      <DayPopup isOpen={dayPopupOpen} onClose={() => { setDayPopupOpen(false); setDayPopupDate(null); }} dateStr={dayPopupDate} events={events.filter(e => e.showInMonthlyYearly !== false)} staff={staff} onAddEvent={openAddEvent} onEditEvent={(e) => { setEditingEvent(e); setEventModalOpen(true); }} onDeleteEvent={handleDeleteEvent} />
    </div>
  );
}

export default App;
