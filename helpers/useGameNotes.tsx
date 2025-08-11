import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGamesNotes } from '../endpoints/games/notes_GET.schema';
import { postGamesNotes, type InputType as CreateNoteInput } from '../endpoints/games/notes_POST.schema';

export const gameNotesQueryKeys = {
  all: ['gameNotes'] as const,
  list: (gameId: number) => [...gameNotesQueryKeys.all, 'list', gameId] as const,
};

export const useGameNotes = (gameId: number) => {
  return useQuery({
    queryKey: gameNotesQueryKeys.list(gameId),
    queryFn: () => getGamesNotes({ gameId }),
    enabled: !!gameId, // Only run query if gameId is available
  });
};

export const useCreateGameNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newNote: CreateNoteInput) => postGamesNotes(newNote),
    onSuccess: (data) => {
      // Invalidate and refetch notes for the specific game
      queryClient.invalidateQueries({ queryKey: gameNotesQueryKeys.list(data.gameId) });
    },
  });
};