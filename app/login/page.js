'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../src/components/AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import styles from '../../src/styles/Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const emailInputRef = useRef(null);

  // Focus on email input when the component mounts
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginSection}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.loginTitle}>Admin Login</h1>
          <p className={styles.loginSubtitle}>Manage your car inventory</p>
        </div>

        <div className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <Input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.formInput}
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <Button
            onClick={handleLogin}
            className={styles.formButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loader}></span>
            ) : (
              'Sign In'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}