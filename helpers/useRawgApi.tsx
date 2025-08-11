import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { postGamesRawgSearch, InputType as RawgSearchInput, OutputType as RawgSearchOutput } from "../endpoints/games/rawg_search_POST.schema";
import { postGamesRawgDetails, InputType as RawgDetailsInput, OutputType as RawgDetailsOutput } from "../endpoints/games/rawg_details_POST.schema";
import { postGamesImportFromRawg, InputType as ImportFromRawgInput, OutputType as ImportFromRawgOutput } from "../endpoints/games/import_from_rawg_POST.schema";

/**
 * React Query hook to search for games on RAWG.io.
 * This is a mutation because it's an explicit user action, not something that runs on component mount.
 */
export const useRawgGameSearch = () => {
  return useMutation<RawgSearchOutput, Error, RawgSearchInput>({
    mutationFn: (variables) => postGamesRawgSearch(variables),
  });
};

/**
 * React Query hook to fetch detailed information for a single game from RAWG.io.
 * @param rawgId The ID of the game on RAWG.io.
 * @param options Optional react-query options. The query is disabled if rawgId is not provided.
 */
export const useRawgGameDetails = (
  rawgId: number | null | undefined,
  options?: Omit<UseQueryOptions<RawgDetailsOutput, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<RawgDetailsOutput, Error>({
    queryKey: ['rawgGameDetails', rawgId],
    queryFn: () => postGamesRawgDetails({ rawgId: rawgId! }),
    enabled: !!rawgId,
    ...options,
  });
};

/**
 * React Query hook to import a game from RAWG.io into the local database.
 */
export const useImportFromRawg = () => {
  return useMutation<ImportFromRawgOutput, Error, ImportFromRawgInput>({
    mutationFn: (variables) => postGamesImportFromRawg(variables),
  });
};