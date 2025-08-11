import { useQuery } from '@tanstack/react-query';
import { postGamesRawgDetails, InputType, OutputType } from '../endpoints/games/rawg_details_POST.schema';

export const useRawgGameDetails = (rawgId: number | null) => {
  return useQuery<OutputType, Error>({
    queryKey: ['rawgGameDetails', rawgId],
    queryFn: () => {
      if (!rawgId) {
        throw new Error("RAWG ID is required to fetch game details.");
      }
      return postGamesRawgDetails({ rawgId });
    },
    enabled: !!rawgId, // Only run query if rawgId is provided
    staleTime: 1000 * 60 * 60, // 1 hour, as details don't change often
  });
};