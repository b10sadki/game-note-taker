import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postGamesStatus, InputType } from '../endpoints/games/status_POST.schema';
import { toast } from 'sonner';
import type { Selectable } from 'kysely';
import type { Games } from './schema';

export const useUpdateGameStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InputType) => postGamesStatus(data),
    onSuccess: (updatedGame) => {
      toast.success(`Game "${updatedGame.name}" status updated to ${updatedGame.status.replace('_', ' ')}.`);
      
      // Invalidate queries that depend on game lists to refetch them
      queryClient.invalidateQueries({ queryKey: ['games'] });

      // Optionally, update the specific game query if one exists
      // queryClient.setQueryData(['game', updatedGame.id], updatedGame);
    },
    onError: (error) => {
      toast.error(`Failed to update game status: ${error.message}`);
    },
  });
};