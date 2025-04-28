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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
    setDropdownTimeout(timeout);
  };

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navbarContainer} container`}>
        {/* Header row: Logo and Nav Links/Hamburger */}
        <div className={styles.navbarHeader}>
          <div className={styles.navbarLeft}>
            <h1 className={styles.navbarTitle}>
              <Link href="/">
                <img
                  src="/images/autotrust.png"
                  alt="AutoTrust Co Logo"
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}