'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '../styles/Navbar.module.css';

export function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [theme, setTheme] = useState('light');

  // Handle resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set initial theme from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Toggle theme and save to localStorage (client-side only)
  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
    setDropdownTimeout(timeout);
  };

  // Clean up dropdownTimeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navbarContainer} container`}>
        <div className={styles.navbarHeader}>
          <div className={styles.navbarLeft}>
            <h1 className={styles.navbarTitle}>
              <Link href="/">
                <img
                  src="/images/primeauto.png"
                  alt="Prime Auto Exchange Logo"
                  className={styles.navbarLogo}
                />
              </Link>
            </h1>
          </div>
          <div className={styles.navbarRight}>
            <button
              className={styles.hamburger}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span className={isOpen ? styles.hamburgerIconOpen : styles.hamburgerIcon}></span>
            </button>
            <div className={`${styles.navbarLinks} ${isOpen ? styles.navbarLinksOpen : ''}`}>
              <Link href="/" className={styles.navbarLink} onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/inventory" className={styles.navbarLink} onClick={() => setIsOpen(false)}>
                Inventory
              </Link>
              {user ? (
                <div
                  className={styles.dropdown}
                  onMouseEnter={isMobile ? undefined : handleMouseEnter}
                  onMouseLeave={isMobile ? undefined : handleMouseLeave}
                >
                  <button
                    className={styles.navbarLink}
                    onClick={isMobile ? toggleDropdown : undefined}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    Admin
                  </button>
                  {isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link
                        href="/admin"
                        className={styles.dropdownItem}
                        onClick={() => {
                          setIsOpen(false);
                          setIsDropdownOpen(false);
                        }}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/add"
                        className={styles.dropdownItem}
                        onClick={() => {
                          setIsOpen(false);
                          setIsDropdownOpen(false);
                        }}
                      >
                        Add Car
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                          setIsDropdownOpen(false);
                        }}
                        className={styles.dropdownButton}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className={styles.navbarLink} onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              )}
              {/* Add theme toggle inside navbarLinks */}
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className={styles.themeToggle}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}