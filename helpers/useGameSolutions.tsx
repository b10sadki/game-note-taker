import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGamesSolutions } from '../endpoints/games/solutions_GET.schema';
import { postGamesSolutions, type InputType as CreateSolutionInput } from '../endpoints/games/solutions_POST.schema';
import { deleteGamesSolutions, type InputType as DeleteSolutionInput } from '../endpoints/games/solutions_DELETE.schema';

export const gameSolutionsQueryKeys = {
  all: ['gameSolutions'] as const,
  list: (gameId: number) => [...gameSolutionsQueryKeys.all, 'list', gameId] as const,
};

export const useGameSolutions = (gameId: number) => {
  return useQuery({
    queryKey: gameSolutionsQueryKeys.list(gameId),
    queryFn: () => getGamesSolutions({ gameId }),
    enabled: !!gameId, // Only run query if gameId is available
  });
};

export const useCreateGameSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSolution: CreateSolutionInput) => postGamesSolutions(newSolution),
    onSuccess: (data) => {
      // Invalidate and refetch solutions for the specific game
      queryClient.invalidateQueries({ queryKey: gameSolutionsQueryKeys.list(data.gameId) });
    },
  });
};

export const useDeleteGameSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deleteSolution: DeleteSolutionInput) => deleteGamesSolutions(deleteSolution),
    onSuccess: (data, variables) => {
      // Invalidate all game solutions queries to refresh the list
      queryClient.invalidateQueries({ queryKey: gameSolutionsQueryKeys.all });
      // Also refetch all queries to ensure immediate update
      queryClient.refetchQueries({ queryKey: gameSolutionsQueryKeys.all });
    },
  });
};