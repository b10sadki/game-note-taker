import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Home, BarChart3 } from 'lucide-react';
import { ThemeModeSwitch } from './ThemeModeSwitch';
import styles from './AppHeader.module.css';

export interface AppHeaderProps {
  /**
   * Optional CSS class to apply to the component
   */
  className?: string;
}

export const AppHeader = ({ className }: AppHeaderProps) => {
  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.branding}>
          <div className={styles.logoWrapper}>
            <Gamepad2 className={styles.logoIcon} />
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.title}>GameNotes</h1>
            <p className={styles.tagline}>AI-Powered Gaming Assistant</p>
          </div>
        </Link>

        <nav className={styles.navigation}>
          <Link to="/" className={styles.navLink}>
            <Home className={styles.navIcon} />
            <span className={styles.navText}>Games</span>
          </Link>
          <Link to="/dashboard" className={styles.navLink}>
            <BarChart3 className={styles.navIcon} />
            <span className={styles.navText}>Dashboard</span>
          </Link>
        </nav>

        <div className={styles.actions}>
          <ThemeModeSwitch />
        </div>
      </div>
    </header>
  );
};