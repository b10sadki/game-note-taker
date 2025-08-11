import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import styles from './KPICard.module.css';

export type KPICardVariant = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: KPICardVariant;
  trend?: 'up' | 'down';
  trendValue?: string;
  className?: string;
}

export const KPICard = ({
  title,
  value,
  icon,
  variant = 'primary',
  trend,
  trendValue,
  className,
}: KPICardProps) => {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className || ''}`}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
        {trend && trendValue && (
          <div className={`${styles.trend} ${styles[`trend-${trend}`]}`}>
            {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};