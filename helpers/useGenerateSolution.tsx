import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { postGamesSolutionsGenerate, InputType } from '../endpoints/games/solutions/generate_POST.schema';

export const useGenerateSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InputType) => postGamesSolutionsGenerate(data),
    onSuccess: (data) => {
      toast.success('AI solution generated successfully!');
      // Invalidate queries that depend on solutions data to refetch
      queryClient.invalidateQueries({ queryKey: ['solutions', data.gameId] });
      queryClient.invalidateQueries({ queryKey: ['games', data.gameId, 'solutions'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate AI solution.');
    },
  });
};