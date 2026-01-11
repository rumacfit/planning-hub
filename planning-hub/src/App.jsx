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
const ListIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#22C55E'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Helpers
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => { const day = new Date(year, month, 1).getDay(); return day === 0 ? 6 : day - 1; };
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
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
  return staffIds.map(id => staff.find(s => String(s.id) === String(id))?.name).filter(Boolean);
};

const getTaskAssignees = (task, staff) => {
  const assignedTo = Array.isArray(task.assignedTo) ? task.assignedTo : (task.assignedTo ? [task.assignedTo] : []);
  return assignedTo.map(id => staff.find(s => String(s.id) === String(id))?.name).filter(Boolean);
};

const getEventColor = (event, staff) => {
  // Use event's own color if set
  if (event.color) return event.color;
  // Fallback to first staff member's color
  const staffIds = event.staffIds || (event.staffId ? [event.staffId] : []);
  if (staffIds.length > 0) {
    const firstStaff = staff.find(s => String(s.id) === String(staffIds[0]));
    return firstStaff?.color || COLORS[0];
  }
  return COLORS[0];
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
  const isSelected = (id) => selectedIds.some(sid => String(sid) === String(id));
  const toggleStaff = (id) => {
    if (single) {
      onChange(isSelected(id) ? [] : [id]);
    } else {
      if (isSelected(id)) onChange(selectedIds.filter(i => String(i) !== String(id)));
      else onChange([...selectedIds, id]);
    }
  };
  return (
    <div className="staff-picker">
      <label>Assign To</label>
      <div className="staff-picker-list">
        {staff.map(s => (
          <label key={s.id} className={`staff-picker-item ${isSelected(s.id) ? 'selected' : ''}`}>
            <input type="checkbox" checked={isSelected(s.id)} onChange={() => toggleStaff(s.id)} />
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

// Staff Filter Dropdown
const StaffFilter = ({ staff, value, onChange }) => (
  <div className="staff-filter">
    <UserIcon />
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="all">All</option>
      {staff.map(s => <option key={s.id} value={String(s.id)}>{s.name.split(' ')[0]}</option>)}
    </select>
  </div>
);

// Color Picker
const ColorPicker = ({ colors, selected, onChange }) => (
  <div className="form-group">
    <label>Event Color</label>
    <div className="color-picker">
      {colors.map(color => (
        <button
          key={color}
          type="button"
          className={`color-swatch ${selected === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
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
        color: event.color || COLORS[0],
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
    const saveData = {
      ...formData,
      endDate: formData.hasEndDate ? formData.endDate : formData.startDate,
      startTime: formData.hasStartTime ? formData.startTime : '',
      endTime: formData.hasEndTime ? formData.endTime : '',
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

            <ColorPicker colors={COLORS} selected={formData.color} onChange={color => setFormData({...formData, color})} />

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
          <>
            <StaffPicker staff={staff} selectedIds={formData.staffIds} onChange={ids => setFormData({...formData, staffIds: ids})} single />
            <ColorPicker colors={COLORS} selected={formData.color} onChange={color => setFormData({...formData, color})} />
          </>
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
const TaskModal = ({ isOpen, onClose, onSave, task, staff, weekStart }) => {
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: formatDate(new Date()), assignedTo: [], status: 'pending', priority: 'medium', isWeeklyTodo: false, weekOf: '' });
  
  useEffect(() => {
    if (task) {
      // Migrate old single assignedTo to array
      const assignedTo = task.assignedTo 
        ? (Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo])
        : [];
      setFormData({ ...task, assignedTo, isWeeklyTodo: task.isWeeklyTodo || false, weekOf: task.weekOf || '' });
    }
    else setFormData({ title: '', description: '', dueDate: formatDate(new Date()), assignedTo: [], status: 'pending', priority: 'medium', isWeeklyTodo: false, weekOf: weekStart || '' });
  }, [task, isOpen, weekStart]);
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    const saveData = { ...formData };
    if (saveData.isWeeklyTodo) {
      saveData.weekOf = weekStart || saveData.weekOf;
    }
    onSave(saveData); 
    onClose(); 
  };
  
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
          <label className="checkbox-label">
            <input type="checkbox" checked={formData.isWeeklyTodo} onChange={e => setFormData({...formData, isWeeklyTodo: e.target.checked})} />
            Weekly Todo (applies to entire week)
          </label>
        </div>
        
        {!formData.isWeeklyTodo && (
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
          </div>
        )}
        
        <StaffPicker staff={staff} selectedIds={formData.assignedTo} onChange={ids => setFormData({...formData, assignedTo: ids})} />
        
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

// Macro Modal
const MacroModal = ({ isOpen, onClose, onSave, dateStr, staffId, existingMacros, staff }) => {
  const [formData, setFormData] = useState({ calories: '', protein: '', carbs: '', fats: '' });
  
  useEffect(() => {
    if (existingMacros) {
      setFormData(existingMacros);
    } else {
      setFormData({ calories: '', protein: '', carbs: '', fats: '' });
    }
  }, [existingMacros, isOpen]);
  
  // Auto-calculate calories when macros change
  const updateMacro = (field, value) => {
    const newData = { ...formData, [field]: value };
    
    // Calculate calories from macros
    const protein = parseFloat(newData.protein) || 0;
    const carbs = parseFloat(newData.carbs) || 0;
    const fats = parseFloat(newData.fats) || 0;
    const calculatedCalories = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    
    if (protein || carbs || fats) {
      newData.calories = calculatedCalories.toString();
    }
    
    setFormData(newData);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(dateStr, staffId, formData);
    onClose();
  };
  
  const date = dateStr ? parseDate(dateStr) : new Date();
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const staffMember = staff?.find(s => String(s.id) === String(staffId));
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Macros - ${formattedDate}`} size="small">
      <form onSubmit={handleSubmit} className="modal-form">
        {staffMember && (
          <div className="macro-staff-badge" style={{ backgroundColor: `${staffMember.color}20`, borderLeft: `3px solid ${staffMember.color}` }}>
            {staffMember.name}
          </div>
        )}
        <div className="form-row macro-inputs">
          <div className="form-group">
            <label>Protein (g)</label>
            <input type="number" value={formData.protein} onChange={e => updateMacro('protein', e.target.value)} placeholder="150" />
          </div>
          <div className="form-group">
            <label>Carbs (g)</label>
            <input type="number" value={formData.carbs} onChange={e => updateMacro('carbs', e.target.value)} placeholder="200" />
          </div>
          <div className="form-group">
            <label>Fats (g)</label>
            <input type="number" value={formData.fats} onChange={e => updateMacro('fats', e.target.value)} placeholder="70" />
          </div>
        </div>
        <div className="form-group calories-display">
          <label>Calories</label>
          <div className="calculated-calories">{formData.calories || '0'}</div>
          <span className="calories-note">Auto-calculated from macros</span>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save Macros</button>
        </div>
      </form>
    </Modal>
  );
};

// Copy Icon
const CopyIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;

// Copy Week Modal
const CopyWeekModal = ({ isOpen, onClose, weekDays, events, macros, staff, filterStaffId, onCopy }) => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [copyMacros, setCopyMacros] = useState(true);
  
  // Get events for this week that belong to the selected staff
  const weekEvents = events.filter(e => {
    if (e.showInDailyWeekly === false) return false;
    const staffIds = e.staffIds || (e.staffId ? [e.staffId] : []);
    if (filterStaffId !== 'all' && !staffIds.some(id => String(id) === String(filterStaffId))) return false;
    
    // Check if event falls within this week
    return weekDays.some(d => isDateInEventRange(formatDate(d), e));
  });
  
  // Get macros for this week
  const weekMacros = weekDays.map(d => {
    const dateStr = formatDate(d);
    const macroKey = `${dateStr}_${filterStaffId}`;
    return { date: dateStr, day: d, macros: macros[macroKey] };
  }).filter(m => m.macros && (m.macros.calories || m.macros.protein));
  
  useEffect(() => {
    if (isOpen) {
      setSelectedEvents(weekEvents.map(e => e.id));
      setCopyMacros(true);
    }
  }, [isOpen]);
  
  const toggleEvent = (id) => {
    setSelectedEvents(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const toggleAll = () => {
    if (selectedEvents.length === weekEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(weekEvents.map(e => e.id));
    }
  };
  
  const handleCopy = () => {
    const eventsToCopy = weekEvents.filter(e => selectedEvents.includes(e.id));
    onCopy(eventsToCopy, copyMacros ? weekMacros : []);
    onClose();
  };
  
  const nextWeekStart = new Date(weekDays[0]);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  const nextWeekEnd = new Date(weekDays[6]);
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
  const nextWeekRange = `${MONTHS[nextWeekStart.getMonth()].slice(0, 3)} ${nextWeekStart.getDate()} - ${nextWeekEnd.getDate()}`;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Copy to Next Week">
      <div className="copy-week-content">
        <p className="copy-week-subtitle">Copy selected items to <strong>{nextWeekRange}</strong></p>
        
        {filterStaffId === 'all' ? (
          <p className="copy-week-warning">Please select a specific person to copy their week.</p>
        ) : (
          <>
            {/* Macros Section */}
            <div className="copy-section">
              <label className="copy-section-header">
                <input type="checkbox" checked={copyMacros} onChange={() => setCopyMacros(!copyMacros)} disabled={weekMacros.length === 0} />
                <span>Macros ({weekMacros.length} days)</span>
              </label>
              {weekMacros.length > 0 && copyMacros && (
                <div className="copy-macro-preview">
                  {weekMacros.map(m => (
                    <div key={m.date} className="copy-macro-day">
                      <span className="copy-macro-day-name">{parseDate(m.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="copy-macro-values">{m.macros.calories} cal</span>
                    </div>
                  ))}
                </div>
              )}
              {weekMacros.length === 0 && <p className="copy-empty">No macros entered this week</p>}
            </div>
            
            {/* Events Section */}
            <div className="copy-section">
              <label className="copy-section-header">
                <input type="checkbox" checked={selectedEvents.length === weekEvents.length && weekEvents.length > 0} onChange={toggleAll} disabled={weekEvents.length === 0} />
                <span>Events ({selectedEvents.length}/{weekEvents.length})</span>
              </label>
              {weekEvents.length > 0 ? (
                <div className="copy-events-list">
                  {weekEvents.map(event => {
                    const color = getEventColor(event, staff);
                    return (
                      <label key={event.id} className="copy-event-item">
                        <input type="checkbox" checked={selectedEvents.includes(event.id)} onChange={() => toggleEvent(event.id)} />
                        <span className="copy-event-color" style={{ backgroundColor: color }}></span>
                        <span className="copy-event-title">{event.title}</span>
                        <span className="copy-event-date">{formatDisplayDate(event.startDate)}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="copy-empty">No events this week</p>
              )}
            </div>
          </>
        )}
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleCopy} disabled={filterStaffId === 'all' || (selectedEvents.length === 0 && !copyMacros)}>
            <CopyIcon /> Copy to Next Week
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Combined Planner View (Weekly + Daily)
const PlannerView = ({ date, events, tasks, staff, macros, currentStaffId, filterStaffId, onFilterStaffChange, onAddEvent, onAddTask, onEditEvent, onEditTask, onDeleteEvent, onDeleteTask, onToggleTask, onToggleEvent, onNavigate, onToday, onSaveMacros, onCopyWeek }) => {
  const [eventSort, setEventSort] = useState('time');
  const [taskSort, setTaskSort] = useState('priority');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [macroModalOpen, setMacroModalOpen] = useState(false);
  const [macroDate, setMacroDate] = useState(null);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  
  // Week calculations
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));
  
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

  const todayStr = formatDate(new Date());
  const isCurrentWeek = weekDays.some(d => formatDate(d) === todayStr);
  
  // Daily data
  const dateStr = formatDate(date);
  const dayEvents = events.filter(e => e.showInDailyWeekly !== false && isDateInEventRange(dateStr, e));
  const weeklyEvents = events.filter(e => e.showInDailyWeekly !== false);
  
  // Filter by staff for pending items
  const filteredEvents = filterStaffId === 'all' ? dayEvents : dayEvents.filter(e => {
    const staffIds = e.staffIds || (e.staffId ? [e.staffId] : []);
    return staffIds.some(id => String(id) === String(filterStaffId));
  });
  const filteredTasks = filterStaffId === 'all' ? tasks : tasks.filter(t => {
    const assignedTo = Array.isArray(t.assignedTo) ? t.assignedTo : (t.assignedTo ? [t.assignedTo] : []);
    return assignedTo.some(id => String(id) === String(filterStaffId));
  });
  const filteredWeeklyEvents = filterStaffId === 'all' ? weeklyEvents : weeklyEvents.filter(e => {
    const staffIds = e.staffIds || (e.staffId ? [e.staffId] : []);
    return staffIds.some(id => String(id) === String(filterStaffId));
  });
  const filteredWeeklyTasks = filterStaffId === 'all' ? tasks : tasks.filter(t => {
    const assignedTo = Array.isArray(t.assignedTo) ? t.assignedTo : (t.assignedTo ? [t.assignedTo] : []);
    return assignedTo.some(id => String(id) === String(filterStaffId));
  });
  
  // Week start string for weekly todos
  const weekStartStr = formatDate(weekDays[0]);
  
  const pendingEvents = filteredEvents.filter(e => e.status !== 'completed');
  // Daily tasks - not weekly todos, due on current day
  const pendingTasks = filteredTasks.filter(t => !t.isWeeklyTodo && t.dueDate === dateStr && t.status !== 'completed');
  // Weekly todos - for this week
  const weeklyTodos = filteredTasks.filter(t => t.isWeeklyTodo && t.weekOf === weekStartStr && t.status !== 'completed');
  
  // Completed section shows ALL completed items for TODAY (not filtered)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const allCompletedEvents = dayEvents.filter(e => e.status === 'completed' && e.completedAt && new Date(e.completedAt) >= todayStart);
  const allCompletedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt && new Date(t.completedAt) >= todayStart).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const allCompleted = [
    ...allCompletedEvents.map(e => ({ ...e, type: 'event' })),
    ...allCompletedTasks.map(t => ({ ...t, type: 'task' }))
  ].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  
  // Sort events
  const sortedEvents = [...pendingEvents].sort((a, b) => {
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
    if (taskSort === 'person') {
      const aFirst = Array.isArray(a.assignedTo) ? (a.assignedTo[0] || 999) : (a.assignedTo || 999);
      const bFirst = Array.isArray(b.assignedTo) ? (b.assignedTo[0] || 999) : (b.assignedTo || 999);
      return aFirst - bFirst;
    }
    return 0;
  });
  
  // Sort weekly todos
  const sortedWeeklyTodos = [...weeklyTodos].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
  
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  const handleItemClick = (item, type, e) => {
    e.stopPropagation();
    setSelectedItem(item);
    setItemType(type);
  };
  
  const handleMacroClick = (dateStr, staffId, e) => {
    e.stopPropagation();
    if (staffId === 'all') {
      alert('Please select a specific person to add macros');
      return;
    }
    setMacroDate(dateStr);
    setMacroModalOpen(true);
  };
  
  // Get macro key for person+date
  const getMacroKey = (dateStr, staffId) => `${dateStr}_${staffId}`;
  
  // Calculate weekly averages
  const weeklyMacroStats = (() => {
    if (filterStaffId === 'all') return null;
    
    let totalCals = 0, totalP = 0, totalC = 0, totalF = 0, daysWithData = 0;
    
    weekDays.forEach(d => {
      const dayDateStr = formatDate(d);
      const macroKey = getMacroKey(dayDateStr, filterStaffId);
      const dayMacros = macros[macroKey];
      
      if (dayMacros && (dayMacros.calories || dayMacros.protein)) {
        totalCals += parseFloat(dayMacros.calories) || 0;
        totalP += parseFloat(dayMacros.protein) || 0;
        totalC += parseFloat(dayMacros.carbs) || 0;
        totalF += parseFloat(dayMacros.fats) || 0;
        daysWithData++;
      }
    });
    
    if (daysWithData === 0) return null;
    
    return {
      avgCals: Math.round(totalCals / daysWithData),
      avgP: Math.round(totalP / daysWithData),
      avgC: Math.round(totalC / daysWithData),
      avgF: Math.round(totalF / daysWithData),
      days: daysWithData
    };
  })();
  
  return (
    <div className="planner-view">
      {/* Week Header */}
      <div className="planner-header">
        <h2>Planner</h2>
        {weeklyMacroStats && (
          <div className="weekly-macro-avg">
            <span className="avg-label">Week Avg ({weeklyMacroStats.days}d):</span>
            <span className="avg-cals">{weeklyMacroStats.avgCals}</span>
            <span className="avg-macros">P{weeklyMacroStats.avgP} C{weeklyMacroStats.avgC} F{weeklyMacroStats.avgF}</span>
          </div>
        )}
        <StaffFilter staff={staff} value={filterStaffId} onChange={onFilterStaffChange} />
        <button className="btn-primary" onClick={() => onAddEvent()}><PlusIcon /> Event</button>
        <button className="btn-secondary" onClick={onAddTask}><PlusIcon /> Task</button>
        <button className="btn-outline" onClick={() => setCopyModalOpen(true)} title="Copy to next week"><CopyIcon /> <span>Copy Week</span></button>
        <div className="date-nav-container">
          <button className="btn-today" onClick={onToday} disabled={isCurrentWeek}>This Week</button>
          <div className="date-navigation">
            <button onClick={() => onNavigate(-7)}><ChevronLeft /></button>
            <span className="week-range">{formatWeekRange()}</span>
            <button onClick={() => onNavigate(7)}><ChevronRight /></button>
          </div>
        </div>
      </div>
      
      {/* Week Grid with Macros */}
      <div className="planner-week">
        <div className="week-grid">
          {weekDays.map((d, i) => {
            const dayDateStr = formatDate(d);
            let dayEvts = filteredWeeklyEvents.filter(e => isDateInEventRange(dayDateStr, e));
            const dayTsks = filteredWeeklyTasks.filter(t => t.dueDate === dayDateStr && t.status !== 'completed');
            const isToday = todayStr === dayDateStr;
            const isSelected = dateStr === dayDateStr;
            
            // Get macros for current filter person
            const macroKey = filterStaffId !== 'all' ? getMacroKey(dayDateStr, filterStaffId) : null;
            const dayMacros = macroKey ? macros[macroKey] : null;
            const hasMacros = dayMacros && (dayMacros.calories || dayMacros.protein);
            
            return (
              <div key={i} className={`week-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`} onClick={() => onNavigate(0, d)}>
                {/* Macro Section */}
                <div className={`week-day-macros ${filterStaffId === 'all' ? 'disabled' : ''}`} onClick={(e) => handleMacroClick(dayDateStr, filterStaffId, e)}>
                  {filterStaffId === 'all' ? (
                    <span className="macro-hint">Select person</span>
                  ) : hasMacros ? (
                    <div className="macro-display">
                      <span className="macro-cal">{dayMacros.calories || '-'}</span>
                      <span className="macro-divider">|</span>
                      <span className="macro-details">P{dayMacros.protein || 0} C{dayMacros.carbs || 0} F{dayMacros.fats || 0}</span>
                    </div>
                  ) : (
                    <span className="macro-add">+ Macros</span>
                  )}
                </div>
                
                <div className="week-day-header">
                  <span className="day-name">{DAYS[i]}</span>
                  <span className="day-number">{d.getDate()}</span>
                </div>
                <div className="week-day-events">
                  {dayEvts.map(event => {
                    const color = getEventColor(event, staff);
                    return (
                      <div key={event.id} className="week-event" style={{ backgroundColor: `${color}20`, borderLeft: `3px solid ${color}` }} onClick={(e) => handleItemClick(event, 'event', e)}>
                        <span className="event-title-small">{event.title}</span>
                      </div>
                    );
                  })}
                  {dayTsks.map(task => (
                    <div key={task.id} className="week-task-small" onClick={(e) => handleItemClick(task, 'task', e)}>
                      <span className="task-title-small">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Daily Section */}
      <div className="planner-daily">
        <div className="daily-header">
          <h3>{formattedDate}</h3>
          <div className="daily-controls">
            <SortDropdown value={eventSort} onChange={setEventSort} options={[{value: 'time', label: 'By Time'}, {value: 'person', label: 'By Person'}]} />
          </div>
        </div>
        
        <div className="daily-content">
          <div className="events-section">
            <div className="section-header">
              <h4>Events</h4>
            </div>
            {sortedEvents.length === 0 ? <p className="empty-state">No events</p> : (
              <div className="events-list">
                {sortedEvents.map(event => {
                  const staffNames = getStaffNames(event, staff);
                  const color = getEventColor(event, staff);
                  const duration = getEventDuration(event);
                  return (
                    <div key={event.id} className="event-card" style={{ borderLeftColor: color }}>
                      <div className="event-checkbox"><input type="checkbox" onChange={() => onToggleEvent(event.id)} title="Mark as done" /></div>
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
              <h4>Tasks</h4>
              <SortDropdown value={taskSort} onChange={setTaskSort} options={[{value: 'priority', label: 'By Priority'}, {value: 'person', label: 'By Person'}]} />
            </div>
            {sortedTasks.length === 0 ? <p className="empty-state">No tasks</p> : (
              <div className="tasks-list">
                {sortedTasks.map(task => {
                  const assigneeNames = getTaskAssignees(task, staff);
                  return (
                    <div key={task.id} className="task-card">
                      <div className="task-checkbox"><input type="checkbox" onChange={() => onToggleTask(task.id)} /></div>
                      <div className="task-content">
                        <div className="task-title">{task.title}</div>
                        {assigneeNames.length > 0 && <div className="task-assignee">{assigneeNames.join(', ')}</div>}
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
          
          <div className="weekly-todos-section">
            <div className="section-header">
              <h4><ListIcon /> Weekly Todo</h4>
            </div>
            {sortedWeeklyTodos.length === 0 ? <p className="empty-state">No weekly todos</p> : (
              <div className="tasks-list">
                {sortedWeeklyTodos.map(task => {
                  const assigneeNames = getTaskAssignees(task, staff);
                  return (
                    <div key={task.id} className="task-card weekly-todo-card">
                      <div className="task-checkbox"><input type="checkbox" onChange={() => onToggleTask(task.id)} /></div>
                      <div className="task-content">
                        <div className="task-title">{task.title}</div>
                        {assigneeNames.length > 0 && <div className="task-assignee">{assigneeNames.join(', ')}</div>}
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

        {allCompleted.length > 0 && (
          <div className="completed-section">
            <div className="section-header"><h4><CheckIcon /> Completed Today</h4></div>
            <div className="completed-list">
              {allCompleted.slice(0, 10).map(item => {
                const completedBy = staff.find(s => String(s.id) === String(item.completedBy));
                const completedDate = item.completedAt ? new Date(item.completedAt) : null;
                const isEvent = item.type === 'event';
                return (
                  <div key={`${item.type}-${item.id}`} className="completed-task">
                    <div className="completed-check"><CheckIcon /></div>
                    <div className="completed-info">
                      <span className="completed-title">{item.title}</span>
                      <span className="completed-type">{isEvent ? 'Event' : 'Task'}{completedBy ? ` • by ${completedBy.name}` : ''}</span>
                    </div>
                    {completedDate && <div className="completed-time">{completedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <ItemPopup isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={selectedItem} type={itemType} staff={staff} onEdit={itemType === 'event' ? onEditEvent : onEditTask} onDelete={itemType === 'event' ? onDeleteEvent : onDeleteTask} onToggle={onToggleTask} />
      <MacroModal isOpen={macroModalOpen} onClose={() => { setMacroModalOpen(false); setMacroDate(null); }} onSave={onSaveMacros} dateStr={macroDate} staffId={filterStaffId} existingMacros={macroDate && filterStaffId !== 'all' ? macros[`${macroDate}_${filterStaffId}`] : null} staff={staff} />
      <CopyWeekModal isOpen={copyModalOpen} onClose={() => setCopyModalOpen(false)} weekDays={weekDays} events={events} macros={macros} staff={staff} filterStaffId={filterStaffId} onCopy={onCopyWeek} />
    </div>
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
  const assignee = type === 'task' ? staff.find(s => String(s.id) === String(item.assignedTo)) : null;
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
            {item.description && <div className="item-popup-description"><strong>Description:</strong><p>{item.description}</p></div>}
          </>
        )}
        
        {type === 'task' && (
          <>
            <p><strong>Due:</strong> {formatDisplayDate(item.dueDate)}</p>
            {assignee && <p><strong>Assigned:</strong> {assignee.name}</p>}
            {item.description && <div className="item-popup-description"><strong>Description:</strong><p>{item.description}</p></div>}
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
      return staffIds.some(id => String(id) === String(selectedStaffId));
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
const DailyView = ({ date, events, tasks, staff, currentStaffId, filterStaffId, onFilterStaffChange, onAddEvent, onAddTask, onEditEvent, onEditTask, onDeleteEvent, onDeleteTask, onToggleTask, onToggleEvent, onNavigate, onToday }) => {
  const [eventSort, setEventSort] = useState('time');
  const [taskSort, setTaskSort] = useState('priority');
  
  const dateStr = formatDate(date);
  const dayEvents = events.filter(e => e.showInDailyWeekly !== false && isDateInEventRange(dateStr, e));
  
  // Filter by staff for pending items
  const filteredEvents = filterStaffId === 'all' ? dayEvents : dayEvents.filter(e => {
    const staffIds = e.staffIds || (e.staffId ? [e.staffId] : []);
    return staffIds.some(id => String(id) === String(filterStaffId));
  });
  const filteredTasks = filterStaffId === 'all' ? tasks : tasks.filter(t => {
    const assignedTo = Array.isArray(t.assignedTo) ? t.assignedTo : (t.assignedTo ? [t.assignedTo] : []);
    return assignedTo.some(id => String(id) === String(filterStaffId));
  });
  
  const pendingEvents = filteredEvents.filter(e => e.status !== 'completed');
  const pendingTasks = filteredTasks.filter(t => t.dueDate === dateStr && t.status !== 'completed');
  
  // Completed section shows ALL completed items for TODAY (not filtered) - shared feed for everyone
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const allCompletedEvents = dayEvents.filter(e => e.status === 'completed' && e.completedAt && new Date(e.completedAt) >= todayStart);
  const allCompletedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt && new Date(t.completedAt) >= todayStart).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  
  // Combine completed events and tasks - shared feed for everyone
  const allCompleted = [
    ...allCompletedEvents.map(e => ({ ...e, type: 'event' })),
    ...allCompletedTasks.map(t => ({ ...t, type: 'task' }))
  ].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  
  // Sort events
  const sortedEvents = [...pendingEvents].sort((a, b) => {
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
    if (taskSort === 'person') {
      const aFirst = Array.isArray(a.assignedTo) ? (a.assignedTo[0] || 999) : (a.assignedTo || 999);
      const bFirst = Array.isArray(b.assignedTo) ? (b.assignedTo[0] || 999) : (b.assignedTo || 999);
      return aFirst - bFirst;
    }
    return 0;
  });
  
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const isToday = formatDate(new Date()) === dateStr;
  
  return (
    <div className="daily-view">
      <div className="view-header">
        <h2>Daily Plan</h2>
        <StaffFilter staff={staff} value={filterStaffId} onChange={onFilterStaffChange} />
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
                    <div className="event-checkbox"><input type="checkbox" onChange={() => onToggleEvent(event.id)} title="Mark as done" /></div>
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
                const assigneeNames = getTaskAssignees(task, staff);
                return (
                  <div key={task.id} className="task-card">
                    <div className="task-checkbox"><input type="checkbox" onChange={() => onToggleTask(task.id)} /></div>
                    <div className="task-content">
                      <div className="task-title">{task.title}</div>
                      {assigneeNames.length > 0 && <div className="task-assignee">{assigneeNames.join(', ')}</div>}
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

      {allCompleted.length > 0 && (
        <div className="completed-section">
          <div className="section-header"><h3><CheckIcon /> Completed Today</h3></div>
          <div className="completed-list">
            {allCompleted.slice(0, 10).map(item => {
              const completedBy = staff.find(s => String(s.id) === String(item.completedBy));
              const completedDate = item.completedAt ? new Date(item.completedAt) : null;
              const isEvent = item.type === 'event';
              return (
                <div key={`${item.type}-${item.id}`} className="completed-task">
                  <div className="completed-check"><CheckIcon /></div>
                  <div className="completed-info">
                    <span className="completed-title">{item.title}</span>
                    <span className="completed-type">{isEvent ? 'Event' : 'Task'}{completedBy ? ` • by ${completedBy.name}` : ''}</span>
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
const WeeklyView = ({ date, events, tasks, staff, filterStaffId, onFilterStaffChange, onNavigate, onToday, onAddEvent, onEditEvent, onDeleteEvent, onEditTask, onDeleteTask, onToggleTask }) => {
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
  
  // Filter by staff
  const filteredEvents = filterStaffId === 'all' ? weeklyEvents : weeklyEvents.filter(e => {
    const staffIds = e.staffIds || (e.staffId ? [e.staffId] : []);
    return staffIds.some(id => String(id) === String(filterStaffId));
  });
  const filteredTasks = filterStaffId === 'all' ? tasks : tasks.filter(t => {
    const assignedTo = Array.isArray(t.assignedTo) ? t.assignedTo : (t.assignedTo ? [t.assignedTo] : []);
    return assignedTo.some(id => String(id) === String(filterStaffId));
  });
  
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
        <StaffFilter staff={staff} value={filterStaffId} onChange={onFilterStaffChange} />
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
          let dayEvents = filteredEvents.filter(e => isDateInEventRange(dateStr, e));
          const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr && t.status !== 'completed');
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
                {dayTasks.map(task => {
                  const assigneeNames = getTaskAssignees(task, staff);
                  return (
                    <div key={task.id} className={`week-task priority-${task.priority}`} onClick={(e) => handleItemClick(task, 'task', e)}>
                      <span className="task-title-small">{task.title}</span>
                      {assigneeNames.length > 0 && <span className="task-assignee-small">{assigneeNames[0]}</span>}
                    </div>
                  );
                })}
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
const MonthlyView = ({ date, events, staff, filterStaffId, onFilterStaffChange, onDateClick, onNavigate, onToday, onAddEvent }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const monthlyEvents = events.filter(e => e.showInMonthlyYearly !== false);
  
  // Filter by staff
  const filteredEvents = filterStaffId === 'all' ? monthlyEvents : monthlyEvents.filter(e => {
    const staffIds = e.staffIds || (e.staffId ? [e.staffId] : []);
    return staffIds.some(id => String(id) === String(filterStaffId));
  });
  
  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(e => isDateInEventRange(dateStr, e));
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
        <StaffFilter staff={staff} value={filterStaffId} onChange={onFilterStaffChange} />
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
  const selectedStaff = selectedStaffId === 'all' ? null : staff.find(s => String(s.id) === String(selectedStaffId));
  
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
              <div className="staff-info">
                <span className="staff-name">{s.name}</span>
                <span className="staff-name-short">{s.name.split(' ')[0]}</span>
                <span className="staff-position">{s.position}</span>
              </div>
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
  const [activeView, setActiveView] = useState('planner');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [staff, setStaff] = useState(defaultStaff);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [macros, setMacros] = useState({});
  const [selectedStaffId, setSelectedStaffId] = useState('all');
  const [filterStaffId, setFilterStaffId] = useState('all');
  const [currentStaffId, setCurrentStaffId] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('planning_hub_current_staff');
    return saved ? Number(saved) : null;
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState('connecting');
  
  // Save currentStaffId to localStorage whenever it changes
  useEffect(() => {
    if (currentStaffId) {
      localStorage.setItem('planning_hub_current_staff', currentStaffId.toString());
    }
  }, [currentStaffId]);
  
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
        setMacros(data.macros || {});
        // Only set currentStaffId if not already set from localStorage
        if (!currentStaffId && data.staff?.length > 0) {
          setCurrentStaffId(data.staff[0].id);
        }
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
    saveToFirebase({ staff, events: newEvents, tasks, macros });
    setEditingEvent(null);
    setEventInitialDate(null);
  };
  
  const handleDeleteEvent = (id) => {
    if (confirm('Delete this event?')) {
      const newEvents = events.filter(e => e.id !== id);
      setEvents(newEvents);
      saveToFirebase({ staff, events: newEvents, tasks, macros });
    }
  };

  const handleToggleEvent = (id) => {
    const newEvents = events.map(e => {
      if (e.id === id) {
        const newStatus = e.status === 'completed' ? 'pending' : 'completed';
        return { 
          ...e, 
          status: newStatus, 
          completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
          completedBy: newStatus === 'completed' ? currentStaffId : null
        };
      }
      return e;
    });
    setEvents(newEvents);
    saveToFirebase({ staff, events: newEvents, tasks, macros });
  };
  
  const handleSaveTask = (taskData) => {
    let newTasks;
    if (editingTask) {
      newTasks = tasks.map(t => t.id === editingTask.id ? { ...taskData, id: t.id } : t);
    } else {
      newTasks = [...tasks, { ...taskData, id: Date.now(), completedAt: null }];
    }
    setTasks(newTasks);
    saveToFirebase({ staff, events, tasks: newTasks, macros });
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
    saveToFirebase({ staff, events, tasks: newTasks, macros });
  };

  const handleDeleteTask = (id) => {
    if (confirm('Delete this task?')) {
      const newTasks = tasks.filter(t => t.id !== id);
      setTasks(newTasks);
      saveToFirebase({ staff, events, tasks: newTasks, macros });
    }
  };
  
  const handleSaveStaff = (staffData) => {
    let newStaff;
    if (editingStaff) {
      newStaff = staff.map(s => String(s.id) === String(editingStaff.id) ? { ...staffData, id: s.id } : s);
    } else {
      newStaff = [...staff, { ...staffData, id: Date.now() }];
    }
    setStaff(newStaff);
    saveToFirebase({ staff: newStaff, events, tasks, macros });
    setEditingStaff(null);
  };
  
  const handleDeleteStaff = (id) => {
    if (confirm('Delete this staff member?')) {
      const newStaff = staff.filter(s => s.id !== id);
      setStaff(newStaff);
      if (selectedStaffId === id) setSelectedStaffId('all');
      if (currentStaffId === id) setCurrentStaffId(newStaff[0]?.id || null);
      saveToFirebase({ staff: newStaff, events, tasks, macros });
    }
  };

  const handleSaveMacros = (dateStr, staffId, macroData) => {
    const macroKey = `${dateStr}_${staffId}`;
    const newMacros = { ...macros, [macroKey]: macroData };
    setMacros(newMacros);
    saveToFirebase({ staff, events, tasks, macros: newMacros });
  };

  const handleCopyWeek = (eventsToCopy, macrosToCopy) => {
    let newEvents = [...events];
    let newMacros = { ...macros };
    
    // Copy events with dates shifted by 7 days
    eventsToCopy.forEach(event => {
      const startDate = parseDate(event.startDate);
      startDate.setDate(startDate.getDate() + 7);
      const newStartDate = formatDate(startDate);
      
      let newEndDate = null;
      if (event.endDate) {
        const endDate = parseDate(event.endDate);
        endDate.setDate(endDate.getDate() + 7);
        newEndDate = formatDate(endDate);
      }
      
      const newEvent = {
        ...event,
        id: Date.now() + Math.random(),
        startDate: newStartDate,
        endDate: newEndDate || newStartDate,
        status: 'pending',
        completedAt: null,
        completedBy: null
      };
      newEvents.push(newEvent);
    });
    
    // Copy macros with dates shifted by 7 days
    macrosToCopy.forEach(({ date, macros: macroData }) => {
      const newDate = parseDate(date);
      newDate.setDate(newDate.getDate() + 7);
      const newDateStr = formatDate(newDate);
      // The staffId is stored in filterStaffId from the planner
      const newMacroKey = `${newDateStr}_${filterStaffId}`;
      newMacros[newMacroKey] = { ...macroData };
    });
    
    setEvents(newEvents);
    setMacros(newMacros);
    saveToFirebase({ staff, events: newEvents, tasks, macros: newMacros });
  };
  
  const handleDayClick = (dateStr) => { setDayPopupDate(dateStr); setDayPopupOpen(true); };
  
  const navigateDate = (direction, specificDate = null) => {
    if (specificDate) {
      setCurrentDate(specificDate);
      return;
    }
    const newDate = new Date(currentDate);
    if (activeView === 'planner') newDate.setDate(newDate.getDate() + direction);
    else if (activeView === 'monthly') {
      if (direction === -1) newDate.setMonth(newDate.getMonth() - 1);
      else if (direction === 1) newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());
  const openAddEvent = (initialDate = null) => { setEditingEvent(null); setEventInitialDate(initialDate || formatDate(currentDate)); setEventModalOpen(true); };
  const openEditTask = (task) => { setEditingTask(task); setTaskModalOpen(true); };
  
  // Calculate week start from current date
  const getWeekStart = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    return formatDate(d);
  };
  
  const currentStaffMember = staff.find(s => String(s.id) === String(currentStaffId));
  
  if (!isLoaded) return <div className="loading">Loading...</div>;
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo"><CalendarIcon /><h1>Planning Hub</h1></div>
        <nav className="nav-tabs">
          <button className={`nav-tab ${activeView === 'planner' ? 'active' : ''}`} onClick={() => setActiveView('planner')}><ClockIcon /> Planner</button>
          <button className={`nav-tab ${activeView === 'monthly' ? 'active' : ''}`} onClick={() => setActiveView('monthly')}><GridIcon /> Monthly</button>
          <button className={`nav-tab ${activeView === 'staff' ? 'active' : ''}`} onClick={() => setActiveView('staff')}><CalendarIcon /> Calendar</button>
        </nav>
        
        <div className="header-right">
          <div className="logged-in-as">
            <UserIcon />
            <select value={currentStaffId || ''} onChange={e => setCurrentStaffId(Number(e.target.value))}>
              {staff.map(s => <option key={s.id} value={s.id}>{s.name.split(' ')[0]}</option>)}
            </select>
          </div>
          <div className={`sync-status ${syncStatus}`}>
            <CloudIcon />
            <span>{syncStatus === 'synced' ? 'Synced' : syncStatus === 'saving' ? 'Saving...' : 'Connecting...'}</span>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {activeView === 'planner' && <PlannerView date={currentDate} events={events} tasks={tasks} staff={staff} macros={macros} currentStaffId={currentStaffId} filterStaffId={filterStaffId} onFilterStaffChange={setFilterStaffId} onAddEvent={() => openAddEvent(formatDate(currentDate))} onAddTask={() => { setEditingTask(null); setTaskModalOpen(true); }} onEditEvent={(e) => { setEditingEvent(e); setEventModalOpen(true); }} onEditTask={openEditTask} onDeleteEvent={handleDeleteEvent} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask} onToggleEvent={handleToggleEvent} onNavigate={navigateDate} onToday={goToToday} onSaveMacros={handleSaveMacros} onCopyWeek={handleCopyWeek} />}
        {activeView === 'monthly' && <MonthlyView date={currentDate} events={events} staff={staff} filterStaffId={filterStaffId} onFilterStaffChange={setFilterStaffId} onDateClick={handleDayClick} onNavigate={navigateDate} onToday={goToToday} onAddEvent={openAddEvent} />}
        {activeView === 'staff' && <StaffCalendarView year={currentYear} staff={staff} events={events} selectedStaffId={selectedStaffId} onSelectStaff={setSelectedStaffId} onAddStaff={() => { setEditingStaff(null); setStaffModalOpen(true); }} onEditStaff={(s) => { setEditingStaff(s); setStaffModalOpen(true); }} onDeleteStaff={handleDeleteStaff} onDateClick={handleDayClick} onYearChange={setCurrentYear} onAddEvent={openAddEvent} />}
      </main>
      
      <EventModal isOpen={eventModalOpen} onClose={() => { setEventModalOpen(false); setEditingEvent(null); setEventInitialDate(null); }} onSave={handleSaveEvent} event={editingEvent} staff={staff} initialDate={eventInitialDate} />
      <TaskModal isOpen={taskModalOpen} onClose={() => { setTaskModalOpen(false); setEditingTask(null); }} onSave={handleSaveTask} task={editingTask} staff={staff} weekStart={getWeekStart()} />
      <StaffModal isOpen={staffModalOpen} onClose={() => { setStaffModalOpen(false); setEditingStaff(null); }} onSave={handleSaveStaff} staffMember={editingStaff} />
      <DayPopup isOpen={dayPopupOpen} onClose={() => { setDayPopupOpen(false); setDayPopupDate(null); }} dateStr={dayPopupDate} events={events.filter(e => e.showInMonthlyYearly !== false)} staff={staff} onAddEvent={openAddEvent} onEditEvent={(e) => { setEditingEvent(e); setEventModalOpen(true); }} onDeleteEvent={handleDeleteEvent} />
    </div>
  );
}

export default App;
