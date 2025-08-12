import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import type { Notes } from '../../helpers/schema';

export const schema = z.object({
  gameId: z.coerce.number().int().positive(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Notes>[];

export const getGamesNotes = async (params: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedParams = schema.parse(params);
  const searchParams = new URLSearchParams({
    gameId: validatedParams.gameId.toString(),
  });

  const result = await fetch(`/api/games/notes?${searchParams.toString()}`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorObject = superjson.parse(await result.text());
                throw new Error((errorObject as { error: string }).error);
  }
  return superjson.parse<OutputType>(await result.text());
};