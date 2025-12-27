import React, { useState, useEffect, useCallback } from 'react';
import { saveData, subscribeToData } from './firebase';
import './App.css';

// Icons
const CalendarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>;
const ChartIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const GridIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const UsersIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,6 15,12 9,18"/></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>;
const CloudIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>;
const SortIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/></svg>;
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#22C55E'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Helpers
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => { const day = new Date(year, month, 1).getDay(); return day === 0 ? 6 : day - 1; };
const formatDate = (date) => date.toISOString().split('T')[0];
const parseDate = (dateStr) => { const [year, month, day] = dateStr.split('-').map(Number); return new Date(year, month - 1, day); };

const isDateInEventRange = (dateStr, event) => {
  const date = parseDate(dateStr);
  const startDate = parseDate(event.startDate || event.date);
  const endDate = event.endDate ? parseDate(event.endDate) : startDate;
  return date >= startDate && date <= endDate;
};

const getEventDuration = (event) => {
  if (!event.endDate || event.endDate === event.startDate) return 1;
  const startDate = parseDate(event.startDate);
  const endDate = parseDate(event.endDate);
  return Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
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

const formatDisplayDate = (dateStr) => {
  const date = parseDate(dateStr);
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
};

// Default data
const defaultStaff = [
  { id: 1, name: 'Karen McElroy', email: 'karen@example.com', position: 'Manager', color: '#3B82F6' },
  { id: 2, name: 'Nathan McElroy', email: 'nathan@example.com', position: 'Coach', color: '#10B981' },
  { id: 3, name: 'Ruby Lewis', email: 'ruby@example.com', position: 'Coach', color: '#EC4899' },
];

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

// Staff Picker
const StaffPicker = ({ staff, selectedIds, onChange, single = false }) => {
  const toggleStaff = (id) => {
    if (single) {
      onChange(selectedIds.includes(id) ? [] : [id]);
    } else {
      if (selectedIds.includes(id)) onChange(selectedIds.filter(i => i !== id));
      else onChange([...selectedIds, id]);
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

// Sort Dropdown
const SortDropdown = ({ value, onChange, options }) => (
  <div className="sort-dropdown">
    <SortIcon />
    <select value={value} onChange={e => onChange(e.target.value)}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

// Event Modal - Simplified
const EventModal = ({ isOpen, onClose, onSave, event, staff, initialDate, isSimple = false }) => {
  const [formData, setFormData] = useState({
    title: '', startDate: formatDate(new Date()), endDate: '', startTime: '', endTime: '',
    location: '', description: '', staffIds: [], color: COLORS[0], isAllDay: true,
    showInDailyWeekly: true, showInMonthlyYearly: true, hasEndDate: false, hasStartTime: false, hasEndTime: false
  });
  
  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        startDate: event.startDate || formatDate(new Date()),
        endDate: event.endDate || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        staffIds: event.staffIds || (event.staffId ? [event.staffId] : []),
        showInDailyWeekly: event.showInDailyWeekly !== false,
        showInMonthlyYearly: event.showInMonthlyYearly !== false,
        hasEndDate: !!event.endDate && event.endDate !== event.startDate,
        hasStartTime: !!event.startTime,
        hasEndTime: !!event.endTime,
        isAllDay: !event.startTime
      });
    } else {
      const dateToUse = initialDate || formatDate(new Date());
      setFormData({
        title: '', startDate: dateToUse, endDate: '', startTime: '', endTime: '',
        location: '', description: '', staffIds: [], color: COLORS[0], isAllDay: true,
        showInDailyWeekly: true, showInMonthlyYearly: true, hasEndDate: false, hasStartTime: false, hasEndTime: false
      });
    }
  }, [event, initialDate, isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    let color = formData.color;
    if (formData.staffIds.length > 0) {
      const firstStaff = staff.find(s => s.id === formData.staffIds[0]);
      if (firstStaff) color = firstStaff.color;
    }
    const saveData = {
      ...formData,
      endDate: formData.hasEndDate ? formData.endDate : formData.startDate,
      startTime: formData.hasStartTime ? formData.startTime : '',
      endTime: formData.hasEndTime ? formData.endTime : '',
      color,
      isAllDay: !formData.hasStartTime
    };
    delete saveData.hasEndDate;
    delete saveData.hasStartTime;
    delete saveData.hasEndTime;
    onSave(saveData);
    onClose();
  };

  const duration = formData.hasEndDate && formData.endDate ? getEventDuration({ startDate: formData.startDate, endDate: formData.endDate }) : 1;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Add Event'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Event Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Event title" required />
        </div>
        
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={formData.hasEndDate} onChange={e => setFormData({...formData, hasEndDate: e.target.checked, endDate: e.target.checked ? formData.startDate : ''})} />
            Add end date (multi-day event)
          </label>
        </div>

        {formData.hasEndDate && (
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} min={formData.startDate} />
            {duration > 1 && <span className="duration-badge-inline">{duration} days</span>}
          </div>
        )}

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={formData.hasStartTime} onChange={e => setFormData({...formData, hasStartTime: e.target.checked, startTime: e.target.checked ? '09:00' : ''})} />
            Add start time
          </label>
        </div>

        {formData.hasStartTime && (
          <div className="form-group">
            <label>Start Time</label>
            <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
          </div>
        )}

        {formData.hasStartTime && (
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.hasEndTime} onChange={e => setFormData({...formData, hasEndTime: e.target.checked, endTime: e.target.checked ? '10:00' : ''})} />
              Add end time
            </label>
          </div>
        )}

        {formData.hasEndTime && (
          <div className="form-group">
            <label>End Time</label>
            <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
          </div>
        )}

        {!isSimple && (
          <>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Location (optional)" />
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
              <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description (optional)" rows={2} />
            </div>
          </>
        )}

        {isSimple && (
          <StaffPicker staff={staff} selectedIds={formData.staffIds} onChange={ids => setFormData({...formData, staffIds: ids})} single />
        )}
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{event ? 'Save' : 'Add Event'}</button>
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
  }, [task, isOpen]);
  
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
          <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description (optional)" rows={2} />
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
          <button type="submit" className="btn-primary">{task ? 'Save' : 'Add Task'}</button>
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
  }, [staffMember, isOpen]);
  
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); onClose(); };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={staffMember ? 'Edit Staff' : 'Add Staff'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Position</label>
          <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
        </div>
        <div className="color-picker">
          <label>Color</label>
          <div className="color-options">
            {COLORS.map(color => (
              <button key={color} type="button" className={`color-option ${formData.color === color ? 'selected' : ''}`} style={{ backgroundColor: color }} onClick={() => setFormData({...formData, color})} />
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{staffMember ? 'Save' : 'Add Staff'}</button>
        </div>
      </form>
    </Modal>
  );
};

// Day Popup
const DayPopup = ({ isOpen, onClose, dateStr, events, staff, onAddEvent, onEditEvent, onDeleteEvent }) => {
  if (!isOpen || !dateStr) return null;
  const date = parseDate(dateStr);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dayEvents = events.filter(e => isDateInEventRange(dateStr, e));
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formattedDate} size="small">
      <div className="day-popup-content">
        {dayEvents.length === 0 ? <p className="empty-state">No events</p> : (
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
                  {event.startTime ? <span className="day-popup-time">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span> : <span className="day-popup-time all-day">All Day</span>}
                  {duration > 1 && <span className="day-popup-duration">{formatDisplayDate(event.startDate)} - {formatDisplayDate(event.endDate)} ({duration} days)</span>}
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

// Event/Task Popup for Weekly View
const ItemPopup = ({ isOpen, onClose, item, type, staff, onEdit, onDelete, onToggle }) => {
  if (!isOpen || !item) return null;
  const staffNames = type === 'event' ? getStaffNames(item, staff) : [];
  const assignee = type === 'task' ? staff.find(s => s.id === item.assignedTo) : null;
  const color = type === 'event' ? getEventColor(item, staff) : '#3B82F6';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type === 'event' ? 'Event Details' : 'Task Details'} size="small">
      <div className="item-popup-content">
        <div className="item-popup-header" style={{ borderLeftColor: color }}>
          <h3>{item.title}</h3>
          {type === 'task' && <span className={`priority-badge ${item.priority}`}>{item.priority}</span>}
        </div>
        
        {type === 'event' && (
          <>
            {item.startTime ? <p><strong>Time:</strong> {item.startTime}{item.endTime ? ` - ${item.endTime}` : ''}</p> : <p><strong>All Day Event</strong></p>}
            {item.endDate && item.endDate !== item.startDate && <p><strong>Dates:</strong> {formatDisplayDate(item.startDate)} - {formatDisplayDate(item.endDate)}</p>}
            {item.location && <p><strong>Location:</strong> {item.location}</p>}
            {staffNames.length > 0 && <p><strong>Assigned:</strong> {staffNames.join(', ')}</p>}
          </>
        )}
        
        {type === 'task' && (
          <>
            <p><strong>Due:</strong> {formatDisplayDate(item.dueDate)}</p>
            {assignee && <p><strong>Assigned:</strong> {assignee.name}</p>}
            {item.description && <p><strong>Description:</strong> {item.description}</p>}
            <p><strong>Status:</strong> {item.status}</p>
          </>
        )}
        
        <div className="item-popup-actions">
          {type === 'task' && item.status !== 'completed' && (
            <button className="btn-success" onClick={() => { onToggle(item.id); onClose(); }}><CheckIcon /> Complete</button>
          )}
          <button className="btn-secondary" onClick={() => { onClose(); onEdit(item); }}><EditIcon /> Edit</button>
          <button className="btn-danger" onClick={() => { onDelete(item.id); onClose(); }}><TrashIcon /> Delete</button>
        </div>
      </div>
    </Modal>
  );
};

// Mini Calendar for Year View - Events in cells
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
    
    days.push(
      <div key={day} className={`mini-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`} onClick={() => onDateClick(dateStr)}>
        <span className="mini-day-number">{day}</span>
        {dayEvents.length > 0 && (
          <div className="mini-day-events">
            {dayEvents.slice(0, 2).map((e, i) => {
              const color = getEventColor(e, staff);
              const staffNames = getStaffNames(e, staff);
              return (
                <div key={i} className="mini-event-bar" style={{ backgroundColor: color }} title={`${e.title}${staffNames.length > 0 ? ' • ' + staffNames.join(', ') : ''}`}>
                  <span className="mini-event-text">{e.title}</span>
                </div>
              );
            })}
            {dayEvents.length > 2 && <div className="mini-event-more">+{dayEvents.length - 2}</div>}
          </div>
        )}
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

// Daily View
const DailyView = ({ date, events, tasks, staff, currentStaffId, onAddEvent, onAddTask, onEditEvent, onEditTask, onDeleteEvent, onDeleteTask, onToggleTask, onNavigate, onToday }) => {
  const [eventSort, setEventSort] = useState('time');
  const [taskSort, setTaskSort] = useState('priority');
  
  const dateStr = formatDate(date);
  const dailyEvents = events.filter(e => e.showInDailyWeekly !== false && isDateInEventRange(dateStr, e));
  const pendingTasks = tasks.filter(t => t.dueDate === dateStr && t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed').sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  
  // Sort events
  const sortedEvents = [...dailyEvents].sort((a, b) => {
    if (eventSort === 'time') return (a.startTime || '00:00').localeCompare(b.startTime || '00:00');
    if (eventSort === 'person') return (a.staffIds?.[0] || 999) - (b.staffIds?.[0] || 999);
    return 0;
  });
  
  // Sort tasks
  const sortedTasks = [...pendingTasks].sort((a, b) => {
    if (taskSort === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (taskSort === 'person') return (a.assignedTo || 999) - (b.assignedTo || 999);
    return 0;
  });
  
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
            <SortDropdown value={eventSort} onChange={setEventSort} options={[{value: 'time', label: 'By Time'}, {value: 'person', label: 'By Person'}]} />
            <button className="btn-primary" onClick={onAddEvent}><PlusIcon /> Add</button>
          </div>
          {sortedEvents.length === 0 ? <p className="empty-state">No events</p> : (
            <div className="events-list">
              {sortedEvents.map(event => {
                const staffNames = getStaffNames(event, staff);
                const color = getEventColor(event, staff);
                const duration = getEventDuration(event);
                return (
                  <div key={event.id} className="event-card" style={{ borderLeftColor: color }}>
                    <div className="event-main">
                      {event.startTime ? <div className="event-time">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</div> : <div className="event-time all-day">All Day</div>}
                      <div className="event-title">{event.title}</div>
                      {duration > 1 && <div className="event-duration">{formatDisplayDate(event.startDate)} - {formatDisplayDate(event.endDate)}</div>}
                      {staffNames.length > 0 && <div className="event-staff">{staffNames.join(', ')}</div>}
                    </div>
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
            <SortDropdown value={taskSort} onChange={setTaskSort} options={[{value: 'priority', label: 'By Priority'}, {value: 'person', label: 'By Person'}]} />
            <button className="btn-primary" onClick={onAddTask}><PlusIcon /> Add</button>
          </div>
          {sortedTasks.length === 0 ? <p className="empty-state">No tasks</p> : (
            <div className="tasks-list">
              {sortedTasks.map(task => {
                const staffMember = staff.find(s => s.id === task.assignedTo);
                return (
                  <div key={task.id} className="task-card">
                    <div className="task-checkbox"><input type="checkbox" onChange={() => onToggleTask(task.id)} /></div>
                    <div className="task-content">
                      <div className="task-title">{task.title}</div>
                      {staffMember && <div className="task-assignee">{staffMember.name}</div>}
                    </div>
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                    <div className="task-actions">
                      <button onClick={() => onEditTask(task)}><EditIcon /></button>
                      <button onClick={() => onDeleteTask(task.id)}><TrashIcon /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div className="completed-section">
          <div className="section-header"><h3><CheckIcon /> Completed</h3></div>
          <div className="completed-list">
            {completedTasks.slice(0, 5).map(task => {
              const staffMember = staff.find(s => s.id === task.assignedTo);
              const completedBy = staff.find(s => s.id === task.completedBy);
              const completedDate = task.completedAt ? new Date(task.completedAt) : null;
              return (
                <div key={task.id} className="completed-task">
                  <div className="completed-check"><CheckIcon /></div>
                  <div className="completed-info">
                    <span className="completed-title">{task.title}</span>
                    {completedBy && <span className="completed-by">by {completedBy.name}</span>}
                  </div>
                  {completedDate && <div className="completed-time">{completedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>}
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
const WeeklyView = ({ date, events, tasks, staff, onNavigate, onToday, onAddEvent, onEditEvent, onDeleteEvent, onEditTask, onDeleteTask, onToggleTask }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [eventSort, setEventSort] = useState('time');
  
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));
  
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

  const todayStr = formatDate(new Date());
  const isCurrentWeek = weekDays.some(d => formatDate(d) === todayStr);

  const handleItemClick = (item, type, e) => {
    e.stopPropagation();
    setSelectedItem(item);
    setItemType(type);
  };
  
  return (
    <div className="weekly-view">
      <div className="view-header">
        <h2>Weekly Plan</h2>
        <SortDropdown value={eventSort} onChange={setEventSort} options={[{value: 'time', label: 'By Time'}, {value: 'person', label: 'By Person'}]} />
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
          let dayEvents = weeklyEvents.filter(e => isDateInEventRange(dateStr, e));
          const dayTasks = tasks.filter(t => t.dueDate === dateStr && t.status !== 'completed');
          const isToday = formatDate(new Date()) === dateStr;
          
          // Sort events
          dayEvents = dayEvents.sort((a, b) => {
            if (eventSort === 'time') return (a.startTime || '00:00').localeCompare(b.startTime || '00:00');
            if (eventSort === 'person') return (a.staffIds?.[0] || 999) - (b.staffIds?.[0] || 999);
            return 0;
          });
          
          return (
            <div key={i} className={`week-day ${isToday ? 'today' : ''}`}>
              <div className="week-day-header">
                <span className="day-name">{DAYS[i]}</span>
                <span className="day-number">{d.getDate()}</span>
              </div>
              <div className="week-day-events">
                {dayEvents.map(event => {
                  const color = getEventColor(event, staff);
                  const staffNames = getStaffNames(event, staff);
                  return (
                    <div key={event.id} className="week-event" style={{ backgroundColor: `${color}20`, borderLeft: `3px solid ${color}` }} onClick={(e) => handleItemClick(event, 'event', e)}>
                      {event.startTime && <span className="event-time-small">{event.startTime}</span>}
                      <span className="event-title-small">{event.title}</span>
                      {staffNames.length > 0 && <span className="event-staff-small">{staffNames[0]}</span>}
                    </div>
                  );
                })}
                {dayTasks.map(task => (
                  <div key={task.id} className={`week-task priority-${task.priority}`} onClick={(e) => handleItemClick(task, 'task', e)}>
                    <span className="task-title-small">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <ItemPopup isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={selectedItem} type={itemType} staff={staff} onEdit={itemType === 'event' ? onEditEvent : onEditTask} onDelete={itemType === 'event' ? onDeleteEvent : onDeleteTask} onToggle={onToggleTask} />
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
          {dayEvents.slice(0, 3).map(event => {
            const staffNames = getStaffNames(event, staff);
            const color = getEventColor(event, staff);
            return (
              <div key={event.id} className="month-event-bar" style={{ backgroundColor: color }}>
                <span className="month-event-title">{event.title}</span>
                {staffNames.length > 0 && <span className="month-event-staff">• {staffNames.join(', ')}</span>}
              </div>
            );
          })}
          {dayEvents.length > 3 && <div className="month-event-more">+{dayEvents.length - 3}</div>}
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
          <UsersIcon /><span>Staff</span>
          <button className="btn-add-staff" onClick={onAddStaff}><PlusIcon /></button>
        </div>
        <div className="staff-list">
          <div className={`staff-item ${selectedStaffId === 'all' ? 'selected' : ''}`} onClick={() => onSelectStaff('all')}>
            <div className="staff-avatar all-staff"><UsersIcon /></div>
            <div className="staff-info"><span className="staff-name">All Staff</span></div>
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
          <h2>{year}</h2>
          {selectedStaff && <span className="viewing-staff" style={{ color: selectedStaff.color }}>• {selectedStaff.name}</span>}
          <button className="btn-primary" onClick={() => onAddEvent()}><PlusIcon /> Add Event</button>
          <div className="year-nav">
            <button onClick={() => onYearChange(year - 1)}><ChevronLeft /></button>
            <span>{year}</span>
            <button onClick={() => onYearChange(year + 1)}><ChevronRight /></button>
          </div>
        </div>
        {selectedStaffId === 'all' && (
          <div className="staff-legend">{staff.map(s => <div key={s.id} className="legend-item"><span className="legend-color" style={{ backgroundColor: s.color }} /><span>{s.name}</span></div>)}</div>
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
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('all');
  const [currentStaffId, setCurrentStaffId] = useState(null);
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
  
  const saveToFirebase = useCallback((data) => {
    setSyncStatus('saving');
    saveData(data).then(() => setSyncStatus('synced')).catch(() => setSyncStatus('error'));
  }, []);
  
  useEffect(() => {
    const unsubscribe = subscribeToData((data) => {
      if (data) {
        const migratedEvents = (data.events || []).map(e => ({
          ...e,
          staffIds: e.staffIds || (e.staffId ? [e.staffId] : [])
        }));
        setStaff(data.staff || defaultStaff);
        setEvents(migratedEvents);
        setTasks(data.tasks || []);
        if (!currentStaffId && data.staff?.length > 0) setCurrentStaffId(data.staff[0].id);
      }
      setIsLoaded(true);
      setSyncStatus('synced');
    });
    return () => unsubscribe();
  }, []);
  
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
        return { 
          ...t, 
          status: newStatus, 
          completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
          completedBy: newStatus === 'completed' ? currentStaffId : null
        };
      }
      return t;
    });
    setTasks(newTasks);
    saveToFirebase({ staff, events, tasks: newTasks });
  };

  const handleDeleteTask = (id) => {
    if (confirm('Delete this task?')) {
      const newTasks = tasks.filter(t => t.id !== id);
      setTasks(newTasks);
      saveToFirebase({ staff, events, tasks: newTasks });
    }
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
      if (currentStaffId === id) setCurrentStaffId(newStaff[0]?.id || null);
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
  const openEditTask = (task) => { setEditingTask(task); setTaskModalOpen(true); };
  
  const currentStaffMember = staff.find(s => s.id === currentStaffId);
  
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
        
        <div className="header-right">
          <div className="logged-in-as">
            <UserIcon />
            <select value={currentStaffId || ''} onChange={e => setCurrentStaffId(Number(e.target.value))}>
              {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className={`sync-status ${syncStatus}`}>
            <CloudIcon />
            <span>{syncStatus === 'synced' ? 'Synced' : syncStatus === 'saving' ? 'Saving...' : 'Connecting...'}</span>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {activeView === 'daily' && <DailyView date={currentDate} events={events} tasks={tasks} staff={staff} currentStaffId={currentStaffId} onAddEvent={() => openAddEvent(formatDate(currentDate))} onAddTask={() => { setEditingTask(null); setTaskModalOpen(true); }} onEditEvent={(e) => { setEditingEvent(e); setEventModalOpen(true); }} onEditTask={openEditTask} onDeleteEvent={handleDeleteEvent} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask} onNavigate={navigateDate} onToday={goToToday} />}
        {activeView === 'weekly' && <WeeklyView date={currentDate} events={events} tasks={tasks} staff={staff} onNavigate={navigateDate} onToday={goToToday} onAddEvent={openAddEvent} onEditEvent={(e) => { setEditingEvent(e); setEventModalOpen(true); }} onDeleteEvent={handleDeleteEvent} onEditTask={openEditTask} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask} />}
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
