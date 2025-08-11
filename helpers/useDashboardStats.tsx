import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, OutputType } from '../endpoints/dashboard/stats_GET.schema';

export const useDashboardStats = () => {
  return useQuery<OutputType, Error>({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats(),
  });
};