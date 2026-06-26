import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Sun, Moon, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { resetToSeedData } = useApp();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('sms_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('sms_theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <GraduationCap size={24} />
        </div>
        <span>SMS Portal</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/students" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Students</span>
        </NavLink>
        <NavLink to="/enrollments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} />
          <span>Enrollments</span>
        </NavLink>
        <NavLink to="/grades" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <GraduationCap size={20} />
          <span>Grades</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to reset all data back to seed defaults?')) {
              resetToSeedData();
            }
          }} 
          className="reset-btn"
          title="Reset back to standard seed data"
        >
          <RotateCcw size={18} />
          <span>Reset Portal</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
