import React from 'react';
import { Helmet } from 'react-helmet';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Swords,
  NotebookText,
  Lightbulb,
  Library,
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import { useDashboardStats } from '../helpers/useDashboardStats';
import { KPICard } from '../components/KPICard';
import { Skeleton } from '../components/Skeleton';
import { AppHeader } from '../components/AppHeader';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '../components/Chart';
import styles from './dashboard.module.css';

const chartConfig: ChartConfig = {
  count: {
    label: 'Games',
  },
  backlog: {
    label: 'Backlog',
    color: 'var(--chart-color-2)',
  },
  in_progress: {
    label: 'In Progress',
    color: 'var(--chart-color-4)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--chart-color-1)',
  },
  abandoned: {
    label: 'Abandoned',
    color: 'var(--chart-color-5)',
  },
};

const DashboardPage = () => {
  const { data, isLoading, isError, error } = useDashboardStats();

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return [
      { status: 'Backlog', count: data.gamesByStatus.backlog, fill: 'var(--color-backlog)' },
      { status: 'In Progress', count: data.gamesByStatus.in_progress, fill: 'var(--color-in_progress)' },
      { status: 'Completed', count: data.gamesByStatus.completed, fill: 'var(--color-completed)' },
      { status: 'Abandoned', count: data.gamesByStatus.abandoned, fill: 'var(--color-abandoned)' },
    ];
  }, [data]);

  const renderSkeletons = () => (
    <>
      <div className={styles.kpiGrid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <Skeleton style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-full)' }} />
            <div className={styles.skeletonText}>
              <Skeleton style={{ width: '100px', height: '1rem', marginBottom: 'var(--spacing-2)' }} />
              <Skeleton style={{ width: '60px', height: '2rem' }} />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.chartSkeleton}>
        <Skeleton style={{ height: '100%', width: '100%' }} />
      </div>
    </>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.container}>
          <h1 className={styles.title}>Dashboard</h1>
          {renderSkeletons()}
        </div>
      );
    }

    if (isError) {
      return (
        <div className={styles.container}>
          <h1 className={styles.title}>Dashboard</h1>
          <div className={styles.errorState}>
            <p>Error loading dashboard data: {error.message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Your gaming journey at a glance.</p>

        <div className={styles.kpiGrid}>
          <KPICard title="Total Games" value={data?.totalGames ?? 0} icon={<Library />} variant="primary" />
          <KPICard title="Notes Taken" value={data?.totalNotes ?? 0} icon={<NotebookText />} variant="secondary" />
          <KPICard title="Solutions Found" value={data?.totalSolutions ?? 0} icon={<Lightbulb />} variant="accent" />
          <KPICard title="Completed Games" value={data?.gamesByStatus.completed ?? 0} icon={<Swords />} variant="success" />
          <KPICard title="Avg Notes/Game" value={data?.avgNotesPerGame.toFixed(2) ?? 0} icon={<BarChart2 />} variant="info" />
          <KPICard title="Avg Solutions/Game" value={data?.avgSolutionsPerGame.toFixed(2) ?? 0} icon={<TrendingUp />} variant="warning" />
        </div>

        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Game Status Distribution</h2>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="status" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
              <ChartTooltip
                cursor={{ fill: 'var(--muted)', radius: 'var(--radius-sm)' }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - GameNotes</title>
        <meta name="description" content="Analytics and statistics for your video game library." />
      </Helmet>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppHeader />
        <main style={{ flex: 1 }}>
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default DashboardPage;