import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGames } from '../endpoints/games_GET.schema';
import { postGames, type InputType as CreateGameInput } from '../endpoints/games_POST.schema';
import { postGamesDelete, type InputType as DeleteGameInput } from '../endpoints/games/delete_POST.schema';

export const gamesQueryKeys = {
  all: ['games'] as const,
};

export const useGames = () => {
  return useQuery({
    queryKey: gamesQueryKeys.all,
    queryFn: () => getGames(),
  });
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newGame: CreateGameInput) => postGames(newGame),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: gamesQueryKeys.all });
    },
  });
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameToDelete: DeleteGameInput) => postGamesDelete(gameToDelete),
    onSuccess: () => {
      // When a game is deleted, invalidate the games list to refetch it
      queryClient.invalidateQueries({ queryKey: gamesQueryKeys.all });
    },
    // onError can be handled in the component using the mutation, e.g., for showing toast notifications.
  });
};