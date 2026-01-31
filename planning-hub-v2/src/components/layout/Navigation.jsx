import React from 'react';
import { CalendarIcon, DumbbellIcon, UtensilsIcon, ListIcon } from '../common/Icons';
import './Navigation.css';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'training', label: 'Training', icon: DumbbellIcon },
    { id: 'meals', label: 'Meals', icon: UtensilsIcon },
    { id: 'tasks', label: 'Tasks', icon: ListIcon },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={24} />
              <span className="bottom-nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
