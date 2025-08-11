import React from 'react';
import { FileText, BrainCircuit, Search } from 'lucide-react';
import styles from './FeatureCards.module.css';

const features = [
  {
    Icon: FileText,
    title: 'Smart Notes',
    description: 'Effortlessly capture and organize your gaming progress, strategies, and discoveries with our intelligent note-taking system.',
    iconClassName: styles.iconPurple,
  },
  {
    Icon: BrainCircuit,
    title: 'AI Solutions',
    description: 'Stuck on a puzzle or boss? Get AI-powered hints, strategies, and full solutions tailored to your specific in-game situation.',
    iconClassName: styles.iconBlue,
  },
  {
    Icon: Search,
    title: 'Global Search',
    description: 'Instantly find any note, solution, or game detail across your entire library with a powerful, lightning-fast search.',
    iconClassName: styles.iconGreen,
  },
];

export const FeatureCards = ({ className }: { className?: string }) => {
  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      {features.map((feature, index) => (
        <div key={index} className={styles.card}>
          <div className={`${styles.iconWrapper} ${feature.iconClassName}`}>
            <feature.Icon size={32} />
          </div>
          <h3 className={styles.title}>{feature.title}</h3>
          <p className={styles.description}>{feature.description}</p>
        </div>
      ))}
    </div>
  );
};