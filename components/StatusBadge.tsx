import React from 'react';
import {
  CheckCircle2,
  Hourglass,
  Play,
  Pause,
  type LucideProps,
} from 'lucide-react';
import type { GameStatus } from '../helpers/schema';
import { Badge } from './Badge';
import type { ComponentProps } from 'react';
import styles from './StatusBadge.module.css';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

type StatusConfig = {
  label: string;
  variant: BadgeVariant;
  Icon: React.FC<LucideProps>;
};

const statusMap: Record<GameStatus, StatusConfig> = {
  not_started: {
    label: 'Not Started',
    variant: 'secondary',
    Icon: Play,
  },
  in_progress: {
    label: 'In Progress',
    variant: 'default',
    Icon: Hourglass,
  },
  completed: {
    label: 'Completed',
    variant: 'success',
    Icon: CheckCircle2,
  },
  on_hold: {
    label: 'On Hold',
    variant: 'outline',
    Icon: Pause,
  },
};

interface StatusBadgeProps {
  status: GameStatus;
  size?: 'small' | 'default' | 'large';
  className?: string;
}

export const StatusBadge = ({
  status,
  size = 'default',
  className,
}: StatusBadgeProps) => {
  const config = statusMap[status];
  if (!config) {
    console.error(`Invalid status provided to StatusBadge: ${status}`);
    return null;
  }

  const { label, variant, Icon } = config;

  const sizeClass = styles[size] || styles.default;

  return (
    <Badge
      variant={variant}
      className={`${styles.statusBadge} ${sizeClass} ${className || ''}`}
    >
      <Icon className={styles.icon} aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
};