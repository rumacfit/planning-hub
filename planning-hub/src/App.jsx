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
const CloseSmallIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>;
const CloudIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>;
const SortIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/></svg>;
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ListIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const UtensilsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>;
const CopySmallIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const SettingsIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const GripIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="9" cy="19" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="15" cy="19" r="2"/></svg>;

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#22C55E'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Micronutrients list with units
const MICRONUTRIENTS = [
  { key: 'vitA', label: 'Vitamin A', unit: 'mcg' },
  { key: 'vitC', label: 'Vitamin C', unit: 'mg' },
  { key: 'vitD', label: 'Vitamin D', unit: 'mcg' },
  { key: 'vitE', label: 'Vitamin E', unit: 'mg' },
  { key: 'vitK', label: 'Vitamin K', unit: 'mcg' },
  { key: 'vitB1', label: 'B1 Thiamin', unit: 'mg' },
  { key: 'vitB2', label: 'B2 Riboflavin', unit: 'mg' },
  { key: 'vitB3', label: 'B3 Niacin', unit: 'mg' },
  { key: 'vitB6', label: 'Vitamin B6', unit: 'mg' },
  { key: 'vitB9', label: 'B9 Folate', unit: 'mcg' },
  { key: 'vitB12', label: 'Vitamin B12', unit: 'mcg' },
  { key: 'calcium', label: 'Calcium', unit: 'mg' },
  { key: 'iron', label: 'Iron', unit: 'mg' },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg' },
  { key: 'phosphorus', label: 'Phosphorus', unit: 'mg' },
  { key: 'potassium', label: 'Potassium', unit: 'mg' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'zinc', label: 'Zinc', unit: 'mg' },
  { key: 'selenium', label: 'Selenium', unit: 'mcg' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
];

// Daily Recommended Intake (RDI) by gender
const RDI = {
  male: {
    vitA: 900, vitC: 90, vitD: 15, vitE: 15, vitK: 120,
    vitB1: 1.2, vitB2: 1.3, vitB3: 16, vitB6: 1.3, vitB9: 400, vitB12: 2.4,
    calcium: 1000, iron: 8, magnesium: 420, phosphorus: 700,
    potassium: 3400, sodium: 2300, zinc: 11, selenium: 55, fiber: 38
  },
  female: {
    vitA: 700, vitC: 75, vitD: 15, vitE: 15, vitK: 90,
    vitB1: 1.1, vitB2: 1.1, vitB3: 14, vitB6: 1.3, vitB9: 400, vitB12: 2.4,
    calcium: 1000, iron: 18, magnesium: 320, phosphorus: 700,
    potassium: 2600, sodium: 2300, zinc: 8, selenium: 55, fiber: 25
  }
};

const FRUIT_VEG_DAILY_TARGET = 5;

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
const TaskModal = ({ isOpen, onClose, onSave, task, staff, weekStart, initialDate }) => {
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: formatDate(new Date()), assignedTo: [], status: 'pending', priority: 'medium', isWeeklyTodo: false, weekOf: '' });
  
  useEffect(() => {
    if (task) {
      // Migrate old single assignedTo to array
      const assignedTo = task.assignedTo 
        ? (Array.isArray(task.assignedTo) ? task.assignedTo : [])
        : [];
      setFormData({ ...task, assignedTo, isWeeklyTodo: task.isWeeklyTodo || false, weekOf: task.weekOf || '' });
    }
    else setFormData({ title: '', description: '', dueDate: initialDate || formatDate(new Date()), assignedTo: [], status: 'pending', priority: 'medium', isWeeklyTodo: false, weekOf: weekStart || '' });
  }, [task, isOpen, weekStart, initialDate]);
  
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

// Default meal structure
const DEFAULT_MEAL_STRUCTURE = ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner'];

// Ingredient Modal
const IngredientModal = ({ isOpen, onClose, onSave, ingredient }) => {
  const emptyMicros = MICRONUTRIENTS.reduce((acc, m) => ({ ...acc, [m.key]: '' }), {});
  const [formData, setFormData] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '', isFruitVeg: false, ...emptyMicros });
  const [showMicros, setShowMicros] = useState(false);
  
  useEffect(() => {
    if (ingredient) {
      setFormData({ ...emptyMicros, isFruitVeg: false, ...ingredient });
      // Auto-show micros if any are filled
      const hasMicros = MICRONUTRIENTS.some(m => ingredient[m.key] > 0);
      setShowMicros(hasMicros);
    } else {
      setFormData({ name: '', calories: '', protein: '', carbs: '', fats: '', isFruitVeg: false, ...emptyMicros });
      setShowMicros(false);
    }
  }, [ingredient, isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const saveData = {
      ...formData,
      id: ingredient?.id || Date.now(),
      calories: parseFloat(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fats: parseFloat(formData.fats) || 0,
      isFruitVeg: formData.isFruitVeg || false
    };
    // Parse all micronutrients
    MICRONUTRIENTS.forEach(m => {
      saveData[m.key] = parseFloat(formData[m.key]) || 0;
    });
    onSave(saveData);
    onClose();
  };
  
  const updateField = (key, value) => setFormData({ ...formData, [key]: value });
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ingredient ? 'Edit Ingredient' : 'Add Ingredient'}>
      <form onSubmit={handleSubmit} className="modal-form ingredient-modal-form">
        <div className="form-group">
          <label>Ingredient Name</label>
          <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Oats" required />
        </div>
        
        <label className="checkbox-label fruit-veg-check">
          <input type="checkbox" checked={formData.isFruitVeg || false} onChange={e => updateField('isFruitVeg', e.target.checked)} />
          <span>🥗 Counts as Fruit/Veg serving</span>
        </label>
        
        <p className="per-100g-note">Nutritional values per 100g</p>
        
        <div className="macro-input-row">
          <div className="form-group">
            <label>Calories</label>
            <input type="number" value={formData.calories} onChange={e => updateField('calories', e.target.value)} placeholder="389" />
          </div>
          <div className="form-group">
            <label>Protein (g)</label>
            <input type="number" value={formData.protein} onChange={e => updateField('protein', e.target.value)} placeholder="16.9" step="0.1" />
          </div>
        </div>
        <div className="macro-input-row">
          <div className="form-group">
            <label>Carbs (g)</label>
            <input type="number" value={formData.carbs} onChange={e => updateField('carbs', e.target.value)} placeholder="66.3" step="0.1" />
          </div>
          <div className="form-group">
            <label>Fats (g)</label>
            <input type="number" value={formData.fats} onChange={e => updateField('fats', e.target.value)} placeholder="6.9" step="0.1" />
          </div>
        </div>
        
        <button type="button" className="micros-toggle" onClick={() => setShowMicros(!showMicros)}>
          {showMicros ? '− Hide' : '+ Show'} Micronutrients
        </button>
        
        {showMicros && (
          <div className="micros-section">
            <div className="micros-grid">
              {MICRONUTRIENTS.map(m => (
                <div key={m.key} className="micro-input">
                  <label>{m.label} <span className="micro-unit">({m.unit})</span></label>
                  <input type="number" value={formData[m.key] || ''} onChange={e => updateField(m.key, e.target.value)} placeholder="0" step="0.01" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{ingredient ? 'Save' : 'Add Ingredient'}</button>
        </div>
      </form>
    </Modal>
  );
};

// Add Food Modal
const AddFoodModal = ({ isOpen, onClose, onSave, ingredients, recipes, mealSlot }) => {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [servingSize, setServingSize] = useState(100);
  const [servings, setServings] = useState(1);
  
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedItem(null);
      setServingSize(100);
      setServings(1);
      setActiveTab('ingredients');
    }
  }, [isOpen]);
  
  const filteredIngredients = (ingredients || []).filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredRecipes = (recipes || []).filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const calculateMacros = () => {
    if (!selectedItem) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    if (activeTab === 'ingredients') {
      const multiplier = servingSize / 100;
      return {
        calories: Math.round(selectedItem.calories * multiplier),
        protein: Math.round(selectedItem.protein * multiplier * 10) / 10,
        carbs: Math.round(selectedItem.carbs * multiplier * 10) / 10,
        fats: Math.round(selectedItem.fats * multiplier * 10) / 10
      };
    } else {
      // Recipe - use perServing macros
      const ps = selectedItem.perServing || { calories: 0, protein: 0, carbs: 0, fats: 0 };
      return {
        calories: Math.round(ps.calories * servings),
        protein: Math.round(ps.protein * servings * 10) / 10,
        carbs: Math.round(ps.carbs * servings * 10) / 10,
        fats: Math.round(ps.fats * servings * 10) / 10
      };
    }
  };
  
  const handleSubmit = () => {
    if (!selectedItem) return;
    const macros = calculateMacros();
    
    if (activeTab === 'ingredients') {
      onSave({
        id: Date.now(),
        ingredientId: selectedItem.id,
        name: selectedItem.name,
        amount: servingSize,
        isRecipe: false,
        ...macros
      });
    } else {
      onSave({
        id: Date.now(),
        recipeId: selectedItem.id,
        name: selectedItem.name,
        amount: servings,
        isRecipe: true,
        ...macros
      });
    }
    onClose();
  };
  
  const macros = calculateMacros();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add to ${mealSlot}`}>
      <div className="food-modal-tabs">
        <button className={`food-modal-tab ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => { setActiveTab('ingredients'); setSelectedItem(null); }}>Ingredients</button>
        <button className={`food-modal-tab ${activeTab === 'meals' ? 'active' : ''}`} onClick={() => { setActiveTab('meals'); setSelectedItem(null); }}>Meals</button>
      </div>
      
      <div className="food-search">
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={`Search ${activeTab}...`} />
      </div>
      
      <div className="food-search-results">
        {activeTab === 'ingredients' ? (
          filteredIngredients.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.8125rem' }}>
              {searchTerm ? 'No ingredients found' : (ingredients?.length === 0 ? 'No ingredients added yet. Add some in the Ingredients tab.' : 'No ingredients match')}
            </div>
          ) : (
            filteredIngredients.map(ing => (
              <div key={ing.id} className={`food-search-item ${selectedItem?.id === ing.id ? 'selected' : ''}`} onClick={() => setSelectedItem(ing)}>
                <span className="food-search-item-name">{ing.name}</span>
                <span className="food-search-item-macros">{ing.calories} cal / 100g</span>
              </div>
            ))
          )
        ) : (
          filteredRecipes.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.8125rem' }}>
              {searchTerm ? 'No meals found' : (recipes?.length === 0 ? 'No meals created yet. Create some in the Meals tab.' : 'No meals match')}
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <div key={recipe.id} className={`food-search-item ${selectedItem?.id === recipe.id ? 'selected' : ''}`} onClick={() => setSelectedItem(recipe)}>
                <span className="food-search-item-name">{recipe.name}</span>
                <span className="food-search-item-macros">{recipe.perServing?.calories || 0} cal / serving</span>
              </div>
            ))
          )
        )}
      </div>
      
      {selectedItem && (
        <>
          <div className="serving-input">
            {activeTab === 'ingredients' ? (
              <>
                <label>Amount:</label>
                <input type="number" value={servingSize} onChange={e => setServingSize(parseFloat(e.target.value) || 0)} min="0" step="5" />
                <span>grams</span>
              </>
            ) : (
              <>
                <label>Servings:</label>
                <input type="number" value={servings} onChange={e => setServings(parseFloat(e.target.value) || 1)} min="0.25" step="0.25" />
                <span>of {selectedItem.servings || 1}</span>
              </>
            )}
          </div>
          <div className="calculated-food-macros">
            <div className="cals">{macros.calories} cal</div>
            <div className="macros">P: {macros.protein}g | C: {macros.carbs}g | F: {macros.fats}g</div>
          </div>
        </>
      )}
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="btn-primary" onClick={handleSubmit} disabled={!selectedItem}>Add</button>
      </div>
    </Modal>
  );
};

// Meal Structure Modal
const MealStructureModal = ({ isOpen, onClose, onSave, structure }) => {
  const [slots, setSlots] = useState([]);
  
  useEffect(() => {
    if (isOpen) {
      setSlots(structure?.length > 0 ? [...structure] : [...DEFAULT_MEAL_STRUCTURE]);
    }
  }, [structure, isOpen]);
  
  const addSlot = () => setSlots([...slots, `Meal ${slots.length + 1}`]);
  const removeSlot = (index) => setSlots(slots.filter((_, i) => i !== index));
  const updateSlot = (index, value) => {
    const newSlots = [...slots];
    newSlots[index] = value;
    setSlots(newSlots);
  };
  
  const handleSave = () => {
    onSave(slots.filter(s => s.trim()));
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Meal Structure">
      <div className="meal-structure-list">
        {slots.map((slot, i) => (
          <div key={i} className="meal-structure-item">
            <input type="text" value={slot} onChange={e => updateSlot(i, e.target.value)} placeholder="Meal name" />
            <button type="button" onClick={() => removeSlot(i)}><TrashIcon /></button>
          </div>
        ))}
      </div>
      <button type="button" className="add-meal-slot-btn" onClick={addSlot}>+ Add Meal Slot</button>
      <div className="modal-actions" style={{ marginTop: '1rem' }}>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="btn-primary" onClick={handleSave}>Save Structure</button>
      </div>
    </Modal>
  );
};

// Copy Meals Modal
const CopyMealsModal = ({ isOpen, onClose, dateStr, mealPlan, onCopy }) => {
  const [targetDate, setTargetDate] = useState('');
  const [copyStructure, setCopyStructure] = useState(true);
  const [copyFoods, setCopyFoods] = useState(true);
  
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setTargetDate(formatDate(tomorrow));
      setCopyStructure(true);
      setCopyFoods(true);
    }
  }, [isOpen]);
  
  const handleCopy = () => {
    onCopy(targetDate, copyStructure, copyFoods);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Copy Meals">
      <div className="modal-form">
        <div className="form-group">
          <label>Copy to date</label>
          <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={copyStructure} onChange={e => setCopyStructure(e.target.checked)} />
            Copy meal structure (slot names)
          </label>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={copyFoods} onChange={e => setCopyFoods(e.target.checked)} />
            Copy foods in each meal
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleCopy} disabled={!targetDate || (!copyStructure && !copyFoods)}>Copy</button>
        </div>
      </div>
    </Modal>
  );
};

// Weekly Goals Modal
const WeeklyGoalsModal = ({ isOpen, onClose, onSave, weekKey, existingGoals }) => {
  const [goals, setGoals] = useState([]);
  
  useEffect(() => {
    if (existingGoals && existingGoals.items) {
      setGoals([...existingGoals.items]);
    } else {
      setGoals([{ id: Date.now(), text: '', completed: false }]);
    }
  }, [existingGoals, isOpen]);
  
  const addGoal = () => {
    setGoals([...goals, { id: Date.now(), text: '', completed: false }]);
  };
  
  const updateGoal = (id, text) => {
    setGoals(goals.map(g => g.id === id ? { ...g, text } : g));
  };
  
  const removeGoal = (id) => {
    if (goals.length > 1) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredGoals = goals.filter(g => g.text.trim());
    onSave(weekKey, { items: filteredGoals });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Weekly Goals">
      <form onSubmit={handleSubmit} className="modal-form">
        <p className="goals-hint">What do you want to achieve this week?</p>
        <div className="weekly-goals-list">
          {goals.map((goal, idx) => (
            <div key={goal.id} className="weekly-goal-input">
              <span className="goal-number">{idx + 1}</span>
              <input 
                type="text" 
                value={goal.text} 
                onChange={e => updateGoal(goal.id, e.target.value)} 
                placeholder="e.g. Finish nutrition automation..."
                autoFocus={idx === goals.length - 1}
              />
              <button type="button" className="goal-remove-btn" onClick={() => removeGoal(goal.id)} disabled={goals.length === 1}><CloseSmallIcon /></button>
            </div>
          ))}
        </div>
        <button type="button" className="add-goal-btn" onClick={addGoal}>+ Add Goal</button>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save Goals</button>
        </div>
      </form>
    </Modal>
  );
};

// Meal Planning Section Component
// Edit Meal Item Modal - Edit a food/recipe in the day's meal plan (doesn't affect original recipe)
const EditMealItemModal = ({ isOpen, onClose, onSave, onDelete, item, ingredients }) => {
  const [formData, setFormData] = useState(null);
  
  useEffect(() => {
    if (item && isOpen) {
      if (item.isRecipe && item.items) {
        // Recipe with editable items
        setFormData({ ...item, items: [...item.items] });
      } else if (item.isRecipe) {
        // Recipe without items array (legacy) - just allow amount change
        setFormData({ ...item });
      } else {
        // Ingredient - allow amount change
        setFormData({ ...item });
      }
    }
  }, [item, isOpen]);
  
  if (!formData) return null;
  
  const recalculateMacros = (items) => {
    return items.reduce((acc, i) => ({
      calories: acc.calories + (i.calories || 0),
      protein: acc.protein + (i.protein || 0),
      carbs: acc.carbs + (i.carbs || 0),
      fats: acc.fats + (i.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };
  
  const handleIngredientAmountChange = (amount) => {
    // Find the original ingredient to recalculate
    const originalIng = ingredients?.find(i => i.id === formData.ingredientId);
    if (originalIng) {
      const multiplier = amount / 100;
      setFormData({
        ...formData,
        amount,
        calories: Math.round(originalIng.calories * multiplier),
        protein: Math.round(originalIng.protein * multiplier * 10) / 10,
        carbs: Math.round(originalIng.carbs * multiplier * 10) / 10,
        fats: Math.round(originalIng.fats * multiplier * 10) / 10
      });
    } else {
      setFormData({ ...formData, amount });
    }
  };
  
  const handleRecipeItemAmountChange = (itemId, newAmount) => {
    const newItems = formData.items.map(i => {
      if (i.id === itemId) {
        const originalIng = ingredients?.find(ing => ing.id === i.ingredientId);
        if (originalIng) {
          const multiplier = newAmount / 100;
          return {
            ...i,
            amount: newAmount,
            calories: Math.round(originalIng.calories * multiplier),
            protein: Math.round(originalIng.protein * multiplier * 10) / 10,
            carbs: Math.round(originalIng.carbs * multiplier * 10) / 10,
            fats: Math.round(originalIng.fats * multiplier * 10) / 10
          };
        }
        return { ...i, amount: newAmount };
      }
      return i;
    });
    const totals = recalculateMacros(newItems);
    setFormData({ ...formData, items: newItems, ...totals });
  };
  
  const handleRemoveRecipeItem = (itemId) => {
    const newItems = formData.items.filter(i => i.id !== itemId);
    const totals = recalculateMacros(newItems);
    setFormData({ ...formData, items: newItems, ...totals });
  };
  
  const handleServingsChange = (servings) => {
    // For recipes without items array, adjust macros based on original per-serving
    if (formData.originalPerServing) {
      const ps = formData.originalPerServing;
      setFormData({
        ...formData,
        amount: servings,
        calories: Math.round(ps.calories * servings),
        protein: Math.round(ps.protein * servings * 10) / 10,
        carbs: Math.round(ps.carbs * servings * 10) / 10,
        fats: Math.round(ps.fats * servings * 10) / 10
      });
    } else {
      setFormData({ ...formData, amount: servings });
    }
  };
  
  const handleSave = () => {
    onSave(formData);
    onClose();
  };
  
  const handleDelete = () => {
    onDelete();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${formData.name}`}>
      <div className="modal-form">
        {formData.isRecipe && formData.items ? (
          // Editable recipe with ingredients
          <>
            <p className="edit-recipe-note">Adjust ingredient amounts for this meal only. Changes won't affect the original recipe.</p>
            <div className="edit-recipe-items">
              {formData.items.map(item => (
                <div key={item.id} className="edit-recipe-item">
                  <span className="edit-item-name">{item.name}</span>
                  <div className="edit-item-amount">
                    <input 
                      type="number" 
                      value={item.amount} 
                      onChange={e => handleRecipeItemAmountChange(item.id, parseFloat(e.target.value) || 0)}
                      min="0"
                      step="5"
                    />
                    <span>g</span>
                  </div>
                  <span className="edit-item-cals">{item.calories} cal</span>
                  <button type="button" className="edit-item-remove" onClick={() => handleRemoveRecipeItem(item.id)}><CloseSmallIcon /></button>
                </div>
              ))}
            </div>
            <div className="edit-recipe-totals">
              <strong>{formData.calories} cal</strong>
              <span>P: {Math.round(formData.protein)}g</span>
              <span>C: {Math.round(formData.carbs)}g</span>
              <span>F: {Math.round(formData.fats)}g</span>
            </div>
          </>
        ) : formData.isRecipe ? (
          // Recipe without items (just servings)
          <div className="serving-input">
            <label>Servings:</label>
            <input 
              type="number" 
              value={formData.amount} 
              onChange={e => handleServingsChange(parseFloat(e.target.value) || 1)}
              min="0.25"
              step="0.25"
            />
            <div className="calculated-food-macros" style={{ marginLeft: '1rem' }}>
              <span><strong>{formData.calories}</strong> cal</span>
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--gray-500)' }}>P{Math.round(formData.protein)} C{Math.round(formData.carbs)} F{Math.round(formData.fats)}</span>
            </div>
          </div>
        ) : (
          // Ingredient
          <div className="serving-input">
            <label>Amount:</label>
            <input 
              type="number" 
              value={formData.amount} 
              onChange={e => handleIngredientAmountChange(parseFloat(e.target.value) || 0)}
              min="0"
              step="5"
            />
            <span>grams</span>
            <div className="calculated-food-macros" style={{ marginLeft: '1rem' }}>
              <span><strong>{formData.calories}</strong> cal</span>
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--gray-500)' }}>P{Math.round(formData.protein)} C{Math.round(formData.carbs)} F{Math.round(formData.fats)}</span>
            </div>
          </div>
        )}
        
        <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn-danger" onClick={handleDelete}>Remove</button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const MealPlanningSection = ({ dateStr, ingredients, recipes, mealPlans, onSaveMealPlan, filterStaffId }) => {
  const [addFoodModalOpen, setAddFoodModalOpen] = useState(false);
  const [addFoodSlot, setAddFoodSlot] = useState(null);
  const [structureModalOpen, setStructureModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  
  // Get meal plan for this date and person
  const mealPlanKey = filterStaffId === 'all' ? dateStr : `${dateStr}_${filterStaffId}`;
  const todayPlan = mealPlans[mealPlanKey] || { structure: [...DEFAULT_MEAL_STRUCTURE], meals: {} };
  
  const handleAddFood = (slotName) => {
    setAddFoodSlot(slotName);
    setAddFoodModalOpen(true);
  };
  
  const handleSaveFood = (food) => {
    const newMeals = { ...todayPlan.meals };
    if (!newMeals[addFoodSlot]) newMeals[addFoodSlot] = [];
    newMeals[addFoodSlot] = [...newMeals[addFoodSlot], food];
    onSaveMealPlan(mealPlanKey, { ...todayPlan, meals: newMeals });
  };
  
  const handleDeleteFood = (slotName, foodId) => {
    const newMeals = { ...todayPlan.meals };
    newMeals[slotName] = newMeals[slotName].filter(f => f.id !== foodId);
    onSaveMealPlan(mealPlanKey, { ...todayPlan, meals: newMeals });
  };
  
  const handleEditFood = (slotName, food) => {
    // If it's a recipe, attach the recipe items for editing
    if (food.isRecipe && food.recipeId) {
      const originalRecipe = recipes?.find(r => r.id === food.recipeId);
      if (originalRecipe && originalRecipe.items && !food.items) {
        // First time editing - copy recipe items scaled to servings
        const servingMultiplier = (food.amount || 1) / (originalRecipe.servings || 1);
        const scaledItems = originalRecipe.items.map(item => ({
          ...item,
          id: Date.now() + Math.random(),
          amount: Math.round(item.amount * servingMultiplier),
          calories: Math.round(item.calories * servingMultiplier),
          protein: Math.round(item.protein * servingMultiplier * 10) / 10,
          carbs: Math.round(item.carbs * servingMultiplier * 10) / 10,
          fats: Math.round(item.fats * servingMultiplier * 10) / 10
        }));
        setEditingItem({ ...food, items: scaledItems, originalPerServing: originalRecipe.perServing });
      } else {
        setEditingItem({ ...food, originalPerServing: originalRecipe?.perServing });
      }
    } else {
      setEditingItem(food);
    }
    setEditingSlot(slotName);
  };
  
  const handleSaveEditedFood = (updatedFood) => {
    const newMeals = { ...todayPlan.meals };
    newMeals[editingSlot] = newMeals[editingSlot].map(f => f.id === updatedFood.id ? updatedFood : f);
    onSaveMealPlan(mealPlanKey, { ...todayPlan, meals: newMeals });
    setEditingItem(null);
    setEditingSlot(null);
  };
  
  const handleDeleteEditedFood = () => {
    handleDeleteFood(editingSlot, editingItem.id);
    setEditingItem(null);
    setEditingSlot(null);
  };
  
  const handleSaveStructure = (structure) => {
    onSaveMealPlan(mealPlanKey, { ...todayPlan, structure });
  };
  
  const handleCopyMeals = (targetDate, copyStructure, copyFoods) => {
    const targetKey = filterStaffId === 'all' ? targetDate : `${targetDate}_${filterStaffId}`;
    const newPlan = {
      structure: copyStructure ? [...todayPlan.structure] : (mealPlans[targetKey]?.structure || [...DEFAULT_MEAL_STRUCTURE]),
      meals: copyFoods ? JSON.parse(JSON.stringify(todayPlan.meals)) : (mealPlans[targetKey]?.meals || {})
    };
    // Generate new IDs for copied foods
    if (copyFoods) {
      Object.keys(newPlan.meals).forEach(slot => {
        newPlan.meals[slot] = newPlan.meals[slot].map(f => ({ ...f, id: Date.now() + Math.random() }));
      });
    }
    onSaveMealPlan(targetKey, newPlan);
  };
  
  // Calculate totals
  const calculateSlotMacros = (slotName) => {
    const foods = todayPlan.meals[slotName] || [];
    return foods.reduce((acc, f) => ({
      calories: acc.calories + (f.calories || 0),
      protein: acc.protein + (f.protein || 0),
      carbs: acc.carbs + (f.carbs || 0),
      fats: acc.fats + (f.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };
  
  const dayTotals = todayPlan.structure.reduce((acc, slot) => {
    const slotMacros = calculateSlotMacros(slot);
    return {
      calories: acc.calories + slotMacros.calories,
      protein: acc.protein + slotMacros.protein,
      carbs: acc.carbs + slotMacros.carbs,
      fats: acc.fats + slotMacros.fats
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  
  return (
    <div className="meals-section">
      <div className="section-header">
        <h4><UtensilsIcon /> Meals</h4>
        <button className="btn-icon-sm" onClick={() => setStructureModalOpen(true)} title="Edit structure"><SettingsIcon /></button>
      </div>
      
      {filterStaffId === 'all' ? (
        <p className="empty-state">Select a person to view meals</p>
      ) : (
        <>
          <div className="meal-slots">
            {todayPlan.structure.map((slotName, idx) => {
              const slotMacros = calculateSlotMacros(slotName);
              const foods = todayPlan.meals[slotName] || [];
              return (
                <div key={idx} className="meal-slot">
                  <div className="meal-slot-header">
                    <span className="meal-slot-name">{slotName}</span>
                    {slotMacros.calories > 0 && (
                      <span className="meal-slot-macros">{slotMacros.calories} cal</span>
                    )}
                  </div>
                  <div className="meal-foods">
                    {foods.map(food => (
                      <div key={food.id} className="meal-food" onClick={() => handleEditFood(slotName, food)}>
                        <span className="meal-food-name">{food.name}</span>
                        <span className="meal-food-amount">{food.amount}{food.isRecipe ? ' srv' : 'g'}</span>
                        <span className="meal-food-cals">{food.calories}</span>
                        <button className="meal-food-delete" onClick={(e) => { e.stopPropagation(); handleDeleteFood(slotName, food.id); }}><CloseSmallIcon /></button>
                      </div>
                    ))}
                  </div>
                  <button className="meal-add-food" onClick={() => handleAddFood(slotName)}>+ Add</button>
                </div>
              );
            })}
          </div>
          
          <div className="meal-day-total">
            <span className="meal-day-total-label">Day Total</span>
            <span className="meal-day-total-macros">
              <strong>{dayTotals.calories}</strong> cal | P{Math.round(dayTotals.protein)} C{Math.round(dayTotals.carbs)} F{Math.round(dayTotals.fats)}
            </span>
          </div>
          
          <div className="meal-structure-actions">
            <button onClick={() => setCopyModalOpen(true)}><CopySmallIcon /> Copy Day</button>
          </div>
        </>
      )}
      
      <AddFoodModal isOpen={addFoodModalOpen} onClose={() => setAddFoodModalOpen(false)} onSave={handleSaveFood} ingredients={ingredients} recipes={recipes} mealSlot={addFoodSlot} />
      <MealStructureModal isOpen={structureModalOpen} onClose={() => setStructureModalOpen(false)} onSave={handleSaveStructure} structure={todayPlan.structure} />
      <CopyMealsModal isOpen={copyModalOpen} onClose={() => setCopyModalOpen(false)} dateStr={dateStr} mealPlan={todayPlan} onCopy={handleCopyMeals} />
      <EditMealItemModal 
        isOpen={!!editingItem} 
        onClose={() => { setEditingItem(null); setEditingSlot(null); }} 
        onSave={handleSaveEditedFood} 
        onDelete={handleDeleteEditedFood} 
        item={editingItem} 
        ingredients={ingredients} 
      />
    </div>
  );
};

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
const PlannerView = ({ date, events, tasks, staff, macros, ingredients, recipes, mealPlans, weeklyGoals, currentStaffId, filterStaffId, onFilterStaffChange, onAddEvent, onAddTask, onEditEvent, onEditTask, onDeleteEvent, onDeleteTask, onToggleTask, onToggleEvent, onReorderTask, onNavigate, onToday, onSaveMacros, onCopyWeek, onSaveMealPlan, onSaveWeeklyGoals }) => {
  const [eventSort, setEventSort] = useState('time');
  const [taskSort, setTaskSort] = useState('priority');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [macroModalOpen, setMacroModalOpen] = useState(false);
  const [macroDate, setMacroDate] = useState(null);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  
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
  
  // Weekly goals key (person + week)
  const weeklyGoalsKey = filterStaffId !== 'all' ? `${weekStartStr}_${filterStaffId}` : null;
  const currentWeekGoals = weeklyGoalsKey ? weeklyGoals[weeklyGoalsKey] : null;
  
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
    if (taskSort === 'manual') {
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    }
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
  
  // Calculate meal totals for a given date
  const getMealTotals = (dayDateStr, staffId) => {
    if (staffId === 'all') return null;
    const mealPlanKey = `${dayDateStr}_${staffId}`;
    const dayPlan = mealPlans[mealPlanKey];
    if (!dayPlan || !dayPlan.meals) return null;
    
    let totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    const structure = dayPlan.structure || [];
    
    structure.forEach(slot => {
      const foods = dayPlan.meals[slot] || [];
      foods.forEach(f => {
        totals.calories += f.calories || 0;
        totals.protein += f.protein || 0;
        totals.carbs += f.carbs || 0;
        totals.fats += f.fats || 0;
      });
    });
    
    if (totals.calories === 0) return null;
    return totals;
  };
  
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
  
  // Calculate weekly micronutrients and fruit/veg from meal plans
  const weeklyNutrition = (() => {
    if (filterStaffId === 'all') return null;
    
    // Determine gender based on staff name (can be improved with gender field later)
    const currentStaffMember = staff.find(s => String(s.id) === String(filterStaffId));
    const staffName = currentStaffMember?.name?.toLowerCase() || '';
    const gender = (staffName.includes('ruby') || staffName.includes('karen')) ? 'female' : 'male';
    const rdi = RDI[gender];
    
    // Initialize totals
    let fruitVegCount = 0;
    let daysWithData = 0;
    const microTotals = MICRONUTRIENTS.reduce((acc, m) => ({ ...acc, [m.key]: 0 }), {});
    
    // Loop through each day of the week
    weekDays.forEach(d => {
      const dayDateStr = formatDate(d);
      const mealPlanKey = `${dayDateStr}_${filterStaffId}`;
      const dayPlan = mealPlans[mealPlanKey];
      if (!dayPlan || !dayPlan.meals) return;
      
      let dayHasData = false;
      const structure = dayPlan.structure || [];
      
      structure.forEach(slot => {
        const foods = dayPlan.meals[slot] || [];
        foods.forEach(food => {
          dayHasData = true;
          
          // Calculate from ingredients
          if (!food.isRecipe) {
            const ing = ingredients.find(i => i.id === food.ingredientId);
            if (ing) {
              const multiplier = (food.amount || 0) / 100;
              if (ing.isFruitVeg) fruitVegCount++;
              MICRONUTRIENTS.forEach(m => {
                microTotals[m.key] += (ing[m.key] || 0) * multiplier;
              });
            }
          } else {
            // Recipe - check if it has items array (edited) or use original recipe
            const recipeItems = food.items || [];
            if (recipeItems.length > 0) {
              recipeItems.forEach(item => {
                const ing = ingredients.find(i => i.id === item.ingredientId);
                if (ing) {
                  const multiplier = (item.amount || 0) / 100;
                  if (ing.isFruitVeg) fruitVegCount++;
                  MICRONUTRIENTS.forEach(m => {
                    microTotals[m.key] += (ing[m.key] || 0) * multiplier;
                  });
                }
              });
            } else {
              // Original recipe
              const recipe = recipes.find(r => r.id === food.recipeId);
              if (recipe && recipe.items) {
                const servingMultiplier = (food.amount || 1) / (recipe.servings || 1);
                recipe.items.forEach(item => {
                  const ing = ingredients.find(i => i.id === item.ingredientId);
                  if (ing) {
                    const multiplier = ((item.amount || 0) / 100) * servingMultiplier;
                    if (ing.isFruitVeg) fruitVegCount++;
                    MICRONUTRIENTS.forEach(m => {
                      microTotals[m.key] += (ing[m.key] || 0) * multiplier;
                    });
                  }
                });
              }
            }
          }
        });
      });
      
      if (dayHasData) daysWithData++;
    });
    
    if (daysWithData === 0) return null;
    
    // Calculate daily averages and compare to RDI
    const microAvgs = {};
    MICRONUTRIENTS.forEach(m => {
      const avg = microTotals[m.key] / daysWithData;
      const target = rdi[m.key] || 0;
      microAvgs[m.key] = {
        value: Math.round(avg * 10) / 10,
        target,
        percent: target > 0 ? Math.round((avg / target) * 100) : 0,
        met: avg >= target
      };
    });
    
    return {
      fruitVegCount,
      fruitVegTarget: FRUIT_VEG_DAILY_TARGET * daysWithData,
      microAvgs,
      daysWithData,
      gender
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
        {/* Weekly Goals Banner */}
        {filterStaffId !== 'all' && (
          <div className="weekly-goals-banner">
            <span className="goals-title">Goals</span>
            {currentWeekGoals && currentWeekGoals.items && currentWeekGoals.items.length > 0 ? (
              <div className="goals-list">
                {currentWeekGoals.items.map(goal => (
                  <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`} onClick={(e) => {
                    e.stopPropagation();
                    const updatedItems = currentWeekGoals.items.map(g => 
                      g.id === goal.id ? { ...g, completed: !g.completed } : g
                    );
                    onSaveWeeklyGoals(weeklyGoalsKey, { items: updatedItems });
                  }}>
                    <span className="goal-check">{goal.completed ? <CheckIcon /> : <span className="goal-circle" />}</span>
                    <span className="goal-text">{goal.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="goals-empty" onClick={() => setGoalsModalOpen(true)}>+ Add goals for this week</span>
            )}
            <button className="goals-edit-btn" onClick={() => setGoalsModalOpen(true)}><EditIcon /></button>
          </div>
        )}
        
        {/* Weekly Nutrition Bar */}
        {filterStaffId !== 'all' && weeklyNutrition && (
          <div className="weekly-nutrition-bar">
            <div className={`nutrition-item fruit-veg ${weeklyNutrition.fruitVegCount >= weeklyNutrition.fruitVegTarget ? 'met' : ''}`}>
              <span className="nutrition-icon">🥗</span>
              <span className="nutrition-label">Fruit & Veg</span>
              <span className="nutrition-value">{weeklyNutrition.fruitVegCount}<span className="nutrition-target">/{weeklyNutrition.fruitVegTarget}</span></span>
            </div>
            <div className="nutrition-divider" />
            <div className="nutrition-micros">
              {MICRONUTRIENTS.map(m => {
                const data = weeklyNutrition.microAvgs[m.key];
                if (!data || data.target === 0) return null;
                return (
                  <div key={m.key} className={`nutrition-item micro ${data.met ? 'met' : ''}`} title={`${m.label}: ${data.value}${m.unit} / ${data.target}${m.unit} daily avg`}>
                    <span className="nutrition-label">{m.label.replace('Vitamin ', 'Vit ')}</span>
                    <span className="nutrition-value">{data.percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
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
                {(() => {
                  const mealTotals = getMealTotals(dayDateStr, filterStaffId);
                  
                  return (
                    <div className={`week-day-macros ${filterStaffId === 'all' ? 'disabled' : ''}`} onClick={(e) => handleMacroClick(dayDateStr, filterStaffId, e)}>
                      {filterStaffId === 'all' ? (
                        <span className="macro-hint">Select person</span>
                      ) : hasMacros ? (
                        <div className="macro-display">
                          <span className="macro-cal">{dayMacros.calories}</span>
                          <span className="macro-details">P{dayMacros.protein || 0} · C{dayMacros.carbs || 0} · F{dayMacros.fats || 0}</span>
                        </div>
                      ) : (
                        <span className="macro-add">+ Macros</span>
                      )}
                      {mealTotals && filterStaffId !== 'all' && (
                        <div className="meal-totals-display">
                          <span className="meal-totals-cal">{mealTotals.calories}</span>
                          <span className="meal-totals-details">P{Math.round(mealTotals.protein)} · C{Math.round(mealTotals.carbs)} · F{Math.round(mealTotals.fats)}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
                
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
              <SortDropdown value={taskSort} onChange={setTaskSort} options={[{value: 'manual', label: 'Manual'}, {value: 'priority', label: 'By Priority'}, {value: 'person', label: 'By Person'}]} />
            </div>
            {sortedTasks.length === 0 ? <p className="empty-state">No tasks</p> : (
              <div className="tasks-list">
                {sortedTasks.map((task, idx) => {
                  const assigneeNames = getTaskAssignees(task, staff);
                  return (
                    <div 
                      key={task.id} 
                      className={`task-card ${taskSort === 'manual' ? 'draggable' : ''}`}
                      draggable={taskSort === 'manual'}
                      onDragStart={(e) => { e.dataTransfer.setData('taskId', task.id); e.dataTransfer.setData('taskType', 'daily'); e.currentTarget.classList.add('dragging'); }}
                      onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
                      onDragOver={(e) => { if (taskSort === 'manual') { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}}
                      onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('drag-over');
                        const draggedId = parseInt(e.dataTransfer.getData('taskId'));
                        if (draggedId !== task.id && e.dataTransfer.getData('taskType') === 'daily') {
                          onReorderTask(draggedId, task.id, 'daily', dateStr);
                        }
                      }}
                    >
                      {taskSort === 'manual' && <div className="drag-handle"><GripIcon /></div>}
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
          
          <MealPlanningSection
            dateStr={dateStr}
            ingredients={ingredients}
            recipes={recipes}
            mealPlans={mealPlans}
            onSaveMealPlan={onSaveMealPlan}
            filterStaffId={filterStaffId}
          />
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
      <WeeklyGoalsModal isOpen={goalsModalOpen} onClose={() => setGoalsModalOpen(false)} onSave={onSaveWeeklyGoals} weekKey={weeklyGoalsKey} existingGoals={currentWeekGoals} />
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

// Ingredients View - Full page for managing ingredients database
const IngredientsView = ({ ingredients, onSave, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  
  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedIngredients = [...filteredIngredients].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="ingredients-view">
      <div className="view-header">
        <h2>Ingredients Database</h2>
        <div className="view-actions">
          <div className="search-box">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search ingredients..." />
          </div>
          <button className="btn-primary" onClick={() => { setEditingIngredient(null); setModalOpen(true); }}><PlusIcon /> Add Ingredient</button>
        </div>
      </div>
      
      <div className="ingredients-grid">
        {sortedIngredients.length === 0 ? (
          <div className="empty-state-large">
            <UtensilsIcon />
            <h3>No ingredients yet</h3>
            <p>Add ingredients with their nutritional info per 100g to start building recipes</p>
            <button className="btn-primary" onClick={() => { setEditingIngredient(null); setModalOpen(true); }}><PlusIcon /> Add First Ingredient</button>
          </div>
        ) : (
          sortedIngredients.map(ing => (
            <div key={ing.id} className="ingredient-card">
              <div className="ingredient-card-header">
                <h3>{ing.name} {ing.isFruitVeg && <span className="fruit-veg-badge">🥗</span>}</h3>
                <div className="ingredient-card-actions">
                  <button onClick={() => { setEditingIngredient(ing); setModalOpen(true); }}><EditIcon /></button>
                  <button onClick={() => onDelete(ing.id)}><TrashIcon /></button>
                </div>
              </div>
              <div className="ingredient-card-macros">
                <div className="macro-item"><span className="macro-value">{ing.calories}</span><span className="macro-label">cal</span></div>
                <div className="macro-item"><span className="macro-value">{ing.protein}g</span><span className="macro-label">protein</span></div>
                <div className="macro-item"><span className="macro-value">{ing.carbs}g</span><span className="macro-label">carbs</span></div>
                <div className="macro-item"><span className="macro-value">{ing.fats}g</span><span className="macro-label">fats</span></div>
              </div>
              <div className="ingredient-card-footer">per 100g</div>
            </div>
          ))
        )}
      </div>
      
      <IngredientModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingIngredient(null); }} onSave={onSave} ingredient={editingIngredient} />
    </div>
  );
};

// Recipe Modal - Create/Edit recipes from ingredients
const RecipeModal = ({ isOpen, onClose, onSave, recipe, ingredients }) => {
  const [formData, setFormData] = useState({ name: '', servings: 1, items: [] });
  const [addingItem, setAddingItem] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [itemAmount, setItemAmount] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (recipe) {
      setFormData({ ...recipe, items: recipe.items || [] });
    } else {
      setFormData({ name: '', servings: 1, items: [] });
    }
    setAddingItem(false);
    setSelectedIngredient(null);
    setItemAmount(100);
    setSearchTerm('');
  }, [recipe, isOpen]);
  
  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const addItem = () => {
    if (!selectedIngredient) return;
    const multiplier = itemAmount / 100;
    const newItem = {
      id: Date.now(),
      ingredientId: selectedIngredient.id,
      name: selectedIngredient.name,
      amount: itemAmount,
      calories: Math.round(selectedIngredient.calories * multiplier),
      protein: Math.round(selectedIngredient.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedIngredient.carbs * multiplier * 10) / 10,
      fats: Math.round(selectedIngredient.fats * multiplier * 10) / 10
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
    setAddingItem(false);
    setSelectedIngredient(null);
    setItemAmount(100);
    setSearchTerm('');
  };
  
  const removeItem = (itemId) => {
    setFormData({ ...formData, items: formData.items.filter(i => i.id !== itemId) });
  };
  
  const totals = formData.items.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fats: acc.fats + item.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  
  const perServing = {
    calories: Math.round(totals.calories / (formData.servings || 1)),
    protein: Math.round(totals.protein / (formData.servings || 1) * 10) / 10,
    carbs: Math.round(totals.carbs / (formData.servings || 1) * 10) / 10,
    fats: Math.round(totals.fats / (formData.servings || 1) * 10) / 10
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: recipe?.id || Date.now(),
      totals,
      perServing
    });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe ? 'Edit Recipe' : 'Create Recipe'}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Recipe Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Overnight Oats" required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Servings</label>
            <input type="number" value={formData.servings} onChange={e => setFormData({...formData, servings: parseInt(e.target.value) || 1})} min="1" />
          </div>
        </div>
        
        <div className="recipe-items-section">
          <label>Ingredients</label>
          <div className="recipe-items-list">
            {formData.items.map(item => (
              <div key={item.id} className="recipe-item">
                <span className="recipe-item-name">{item.name}</span>
                <span className="recipe-item-amount">{item.amount}g</span>
                <span className="recipe-item-cals">{item.calories} cal</span>
                <button type="button" className="recipe-item-delete" onClick={() => removeItem(item.id)}><CloseSmallIcon /></button>
              </div>
            ))}
          </div>
          
          {addingItem ? (
            <div className="add-item-form">
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search ingredients..." className="item-search" />
              <div className="item-search-results">
                {filteredIngredients.slice(0, 5).map(ing => (
                  <div key={ing.id} className={`item-search-result ${selectedIngredient?.id === ing.id ? 'selected' : ''}`} onClick={() => setSelectedIngredient(ing)}>
                    <span>{ing.name}</span>
                    <span className="result-cals">{ing.calories} cal/100g</span>
                  </div>
                ))}
              </div>
              {selectedIngredient && (
                <div className="item-amount-row">
                  <input type="number" value={itemAmount} onChange={e => setItemAmount(parseFloat(e.target.value) || 0)} min="0" step="5" />
                  <span>grams</span>
                  <button type="button" className="btn-primary btn-sm" onClick={addItem}>Add</button>
                  <button type="button" className="btn-secondary btn-sm" onClick={() => setAddingItem(false)}>Cancel</button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="add-item-btn" onClick={() => setAddingItem(true)}>+ Add Ingredient</button>
          )}
        </div>
        
        {formData.items.length > 0 && (
          <div className="recipe-totals">
            <div className="recipe-totals-row">
              <span>Total:</span>
              <span><strong>{totals.calories}</strong> cal</span>
              <span>P: {Math.round(totals.protein)}g</span>
              <span>C: {Math.round(totals.carbs)}g</span>
              <span>F: {Math.round(totals.fats)}g</span>
            </div>
            <div className="recipe-totals-row per-serving">
              <span>Per Serving:</span>
              <span><strong>{perServing.calories}</strong> cal</span>
              <span>P: {perServing.protein}g</span>
              <span>C: {perServing.carbs}g</span>
              <span>F: {perServing.fats}g</span>
            </div>
          </div>
        )}
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={!formData.name || formData.items.length === 0}>{recipe ? 'Save' : 'Create Recipe'}</button>
        </div>
      </form>
    </Modal>
  );
};

// Meals/Recipes View - Full page for managing recipes
const MealsView = ({ recipes, ingredients, onSave, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  
  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedRecipes = [...filteredRecipes].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="meals-view">
      <div className="view-header">
        <h2>Recipes</h2>
        <div className="view-actions">
          <div className="search-box">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search recipes..." />
          </div>
          <button className="btn-primary" onClick={() => { setEditingRecipe(null); setModalOpen(true); }}><PlusIcon /> Create Recipe</button>
        </div>
      </div>
      
      <div className="recipes-grid">
        {sortedRecipes.length === 0 ? (
          <div className="empty-state-large">
            <UtensilsIcon />
            <h3>No recipes yet</h3>
            <p>Create recipes by combining ingredients from your database</p>
            <button className="btn-primary" onClick={() => { setEditingRecipe(null); setModalOpen(true); }}><PlusIcon /> Create First Recipe</button>
          </div>
        ) : (
          sortedRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-card-header">
                <h3>{recipe.name}</h3>
                <div className="recipe-card-actions">
                  <button onClick={() => { setEditingRecipe(recipe); setModalOpen(true); }}><EditIcon /></button>
                  <button onClick={() => onDelete(recipe.id)}><TrashIcon /></button>
                </div>
              </div>
              <div className="recipe-card-info">
                <span className="recipe-servings">{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                <span className="recipe-items-count">{recipe.items?.length || 0} ingredients</span>
              </div>
              <div className="recipe-card-macros">
                <div className="macro-item highlight"><span className="macro-value">{recipe.perServing?.calories || 0}</span><span className="macro-label">cal/serving</span></div>
                <div className="macro-item"><span className="macro-value">{recipe.perServing?.protein || 0}g</span><span className="macro-label">protein</span></div>
                <div className="macro-item"><span className="macro-value">{recipe.perServing?.carbs || 0}g</span><span className="macro-label">carbs</span></div>
                <div className="macro-item"><span className="macro-value">{recipe.perServing?.fats || 0}g</span><span className="macro-label">fats</span></div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <RecipeModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingRecipe(null); }} onSave={onSave} recipe={editingRecipe} ingredients={ingredients} />
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
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState({});
  const [weeklyGoals, setWeeklyGoals] = useState({});
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
        setIngredients(data.ingredients || []);
        setRecipes(data.recipes || []);
        setMealPlans(data.mealPlans || {});
        setWeeklyGoals(data.weeklyGoals || {});
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
    saveToFirebase({ staff, events: newEvents, tasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
    setEditingEvent(null);
    setEventInitialDate(null);
  };
  
  const handleDeleteEvent = (id) => {
    if (confirm('Delete this event?')) {
      const newEvents = events.filter(e => e.id !== id);
      setEvents(newEvents);
      saveToFirebase({ staff, events: newEvents, tasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
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
    saveToFirebase({ staff, events: newEvents, tasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
  };
  
  const handleSaveTask = (taskData) => {
    let newTasks;
    if (editingTask) {
      newTasks = tasks.map(t => t.id === editingTask.id ? { ...taskData, id: t.id } : t);
    } else {
      newTasks = [...tasks, { ...taskData, id: Date.now(), completedAt: null }];
    }
    setTasks(newTasks);
    saveToFirebase({ staff, events, tasks: newTasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
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
    saveToFirebase({ staff, events, tasks: newTasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
  };

  const handleDeleteTask = (id) => {
    if (confirm('Delete this task?')) {
      const newTasks = tasks.filter(t => t.id !== id);
      setTasks(newTasks);
      saveToFirebase({ staff, events, tasks: newTasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
    }
  };
  
  const handleReorderTask = (draggedId, targetId, taskType, dateStr) => {
    if (draggedId === targetId) return;
    
    // Get tasks for this date/type, sorted by current order
    const relevantTasks = tasks
      .filter(t => {
        if (taskType === 'daily') return !t.isWeeklyTodo && t.dueDate === dateStr;
        return t.isWeeklyTodo;
      })
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    // Find current positions
    const draggedIdx = relevantTasks.findIndex(t => t.id === draggedId);
    const targetIdx = relevantTasks.findIndex(t => t.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) return;
    
    // Remove dragged item and insert at target position
    const reordered = [...relevantTasks];
    const [draggedTask] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIdx, 0, draggedTask);
    
    // Create a map of new sort orders for relevant tasks only
    const newOrderMap = {};
    reordered.forEach((t, idx) => {
      newOrderMap[t.id] = idx;
    });
    
    // Update only the relevant tasks with new sort orders
    const newTasks = tasks.map(t => {
      if (newOrderMap.hasOwnProperty(t.id)) {
        return { ...t, sortOrder: newOrderMap[t.id] };
      }
      return t;
    });
    
    setTasks(newTasks);
    saveToFirebase({ staff, events, tasks: newTasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
  };
  
  const handleSaveStaff = (staffData) => {
    let newStaff;
    if (editingStaff) {
      newStaff = staff.map(s => String(s.id) === String(editingStaff.id) ? { ...staffData, id: s.id } : s);
    } else {
      newStaff = [...staff, { ...staffData, id: Date.now() }];
    }
    setStaff(newStaff);
    saveToFirebase({ staff: newStaff, events, tasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
    setEditingStaff(null);
  };
  
  const handleDeleteStaff = (id) => {
    if (confirm('Delete this staff member?')) {
      const newStaff = staff.filter(s => s.id !== id);
      setStaff(newStaff);
      if (selectedStaffId === id) setSelectedStaffId('all');
      if (currentStaffId === id) setCurrentStaffId(newStaff[0]?.id || null);
      saveToFirebase({ staff: newStaff, events, tasks, macros, ingredients, recipes, mealPlans, weeklyGoals });
    }
  };

  const handleSaveMacros = (dateStr, staffId, macroData) => {
    const macroKey = `${dateStr}_${staffId}`;
    const newMacros = { ...macros, [macroKey]: macroData };
    setMacros(newMacros);
    saveToFirebase({ staff, events, tasks, macros: newMacros, ingredients, recipes, mealPlans, weeklyGoals });
  };

  const handleSaveIngredient = (ingredientData) => {
    let newIngredients;
    const existingIndex = ingredients.findIndex(i => i.id === ingredientData.id);
    if (existingIndex >= 0) {
      newIngredients = ingredients.map(i => i.id === ingredientData.id ? ingredientData : i);
    } else {
      newIngredients = [...ingredients, ingredientData];
    }
    setIngredients(newIngredients);
    saveToFirebase({ staff, events, tasks, macros, ingredients: newIngredients, recipes, mealPlans, weeklyGoals });
  };

  const handleDeleteIngredient = (ingredientId) => {
    if (!window.confirm('Delete this ingredient?')) return;
    const newIngredients = ingredients.filter(i => i.id !== ingredientId);
    setIngredients(newIngredients);
    saveToFirebase({ staff, events, tasks, macros, ingredients: newIngredients, recipes, mealPlans, weeklyGoals });
  };

  const handleSaveRecipe = (recipeData) => {
    let newRecipes;
    const existingIndex = recipes.findIndex(r => r.id === recipeData.id);
    if (existingIndex >= 0) {
      newRecipes = recipes.map(r => r.id === recipeData.id ? recipeData : r);
    } else {
      newRecipes = [...recipes, recipeData];
    }
    setRecipes(newRecipes);
    saveToFirebase({ staff, events, tasks, macros, ingredients, recipes: newRecipes, mealPlans, weeklyGoals });
  };

  const handleDeleteRecipe = (recipeId) => {
    if (!window.confirm('Delete this recipe?')) return;
    const newRecipes = recipes.filter(r => r.id !== recipeId);
    setRecipes(newRecipes);
    saveToFirebase({ staff, events, tasks, macros, ingredients, recipes: newRecipes, mealPlans, weeklyGoals });
  };

  const handleSaveMealPlan = (mealPlanKey, planData) => {
    const newMealPlans = { ...mealPlans, [mealPlanKey]: planData };
    setMealPlans(newMealPlans);
    saveToFirebase({ staff, events, tasks, macros, ingredients, recipes, mealPlans: newMealPlans, weeklyGoals });
  };

  const handleSaveWeeklyGoals = (weekKey, goalsData) => {
    const newWeeklyGoals = { ...weeklyGoals, [weekKey]: goalsData };
    setWeeklyGoals(newWeeklyGoals);
    saveToFirebase({ staff, events, tasks, macros, ingredients, recipes, mealPlans, weeklyGoals: newWeeklyGoals });
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
    saveToFirebase({ staff, events: newEvents, tasks, macros: newMacros, ingredients, recipes, mealPlans, weeklyGoals });
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
          <button className={`nav-tab ${activeView === 'meals' ? 'active' : ''}`} onClick={() => setActiveView('meals')}><UtensilsIcon /> Meals</button>
          <button className={`nav-tab ${activeView === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveView('ingredients')}><ChartIcon /> Ingredients</button>
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
        {activeView === 'planner' && <PlannerView date={currentDate} events={events} tasks={tasks} staff={staff} macros={macros} ingredients={ingredients} recipes={recipes} mealPlans={mealPlans} weeklyGoals={weeklyGoals} currentStaffId={currentStaffId} filterStaffId={filterStaffId} onFilterStaffChange={setFilterStaffId} onAddEvent={() => openAddEvent(formatDate(currentDate))} onAddTask={() => { setEditingTask(null); setTaskModalOpen(true); }} onEditEvent={(e) => { setEditingEvent(e); setEventModalOpen(true); }} onEditTask={openEditTask} onDeleteEvent={handleDeleteEvent} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask} onToggleEvent={handleToggleEvent} onReorderTask={handleReorderTask} onNavigate={navigateDate} onToday={goToToday} onSaveMacros={handleSaveMacros} onCopyWeek={handleCopyWeek} onSaveMealPlan={handleSaveMealPlan} onSaveWeeklyGoals={handleSaveWeeklyGoals} />}
        {activeView === 'monthly' && <MonthlyView date={currentDate} events={events} staff={staff} filterStaffId={filterStaffId} onFilterStaffChange={setFilterStaffId} onDateClick={handleDayClick} onNavigate={navigateDate} onToday={goToToday} onAddEvent={openAddEvent} />}
        {activeView === 'staff' && <StaffCalendarView year={currentYear} staff={staff} events={events} selectedStaffId={selectedStaffId} onSelectStaff={setSelectedStaffId} onAddStaff={() => { setEditingStaff(null); setStaffModalOpen(true); }} onEditStaff={(s) => { setEditingStaff(s); setStaffModalOpen(true); }} onDeleteStaff={handleDeleteStaff} onDateClick={handleDayClick} onYearChange={setCurrentYear} onAddEvent={openAddEvent} />}
        {activeView === 'meals' && <MealsView recipes={recipes} ingredients={ingredients} onSave={handleSaveRecipe} onDelete={handleDeleteRecipe} />}
        {activeView === 'ingredients' && <IngredientsView ingredients={ingredients} onSave={handleSaveIngredient} onDelete={handleDeleteIngredient} />}
      </main>
      
      <EventModal isOpen={eventModalOpen} onClose={() => { setEventModalOpen(false); setEditingEvent(null); setEventInitialDate(null); }} onSave={handleSaveEvent} event={editingEvent} staff={staff} initialDate={eventInitialDate} />
      <TaskModal isOpen={taskModalOpen} onClose={() => { setTaskModalOpen(false); setEditingTask(null); }} onSave={handleSaveTask} task={editingTask} staff={staff} weekStart={getWeekStart()} initialDate={formatDate(currentDate)} />
      <StaffModal isOpen={staffModalOpen} onClose={() => { setStaffModalOpen(false); setEditingStaff(null); }} onSave={handleSaveStaff} staffMember={editingStaff} />
      <DayPopup isOpen={dayPopupOpen} onClose={() => { setDayPopupOpen(false); setDayPopupDate(null); }} dateStr={dayPopupDate} events={events.filter(e => e.showInMonthlyYearly !== false)} staff={staff} onAddEvent={openAddEvent} onEditEvent={(e) => { setEditingEvent(e); setEventModalOpen(true); }} onDeleteEvent={handleDeleteEvent} />
    </div>
  );
}

export default App;
