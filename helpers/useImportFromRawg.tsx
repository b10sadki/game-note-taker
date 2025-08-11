import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postGamesImportFromRawg, InputType, OutputType } from '../endpoints/games/import_from_rawg_POST.schema';

export const useImportFromRawg = () => {
  const queryClient = useQueryClient();

  return useMutation<OutputType, Error, InputType>({
    mutationFn: postGamesImportFromRawg,
    onSuccess: () => {
      // Invalidate queries that are affected by this mutation
      queryClient.invalidateQueries({ queryKey: ['games'] }); // Assuming a query for all games exists
    },
  });
};