'use client'; // Mark as Client Component

import { useEffect, useState } from 'react';
import styles from '../styles/ThemeToggle.module.css'; // CSS for the toggle button

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light'); // Default to light mode

  // On mount, check localStorage for saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button onClick={toggleTheme} className={styles.themeToggle}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};

export default ThemeToggle;