import { useQuery } from '@tanstack/react-query';
import { postGamesRawgSearch, InputType, OutputType } from '../endpoints/games/rawg_search_POST.schema';

export const useRawgGameSearch = (searchQuery: string) => {
  return useQuery<OutputType, Error>({
    queryKey: ['rawgGameSearch', searchQuery],
    queryFn: () => postGamesRawgSearch({ searchQuery }),
    enabled: !!searchQuery && searchQuery.length > 0, // Only run query if searchQuery is not empty
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};