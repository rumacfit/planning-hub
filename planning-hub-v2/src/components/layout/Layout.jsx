import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import './Layout.css';

const Layout = ({ children, currentDate, onDateChange, activeTab, onTabChange }) => {
  return (
    <div className="layout">
      <Header currentDate={currentDate} onDateChange={onDateChange} />
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
