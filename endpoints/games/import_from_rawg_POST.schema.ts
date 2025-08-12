import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import type { Games, GameStatus } from '../../helpers/schema';
import { GameStatusArrayValues } from '../../helpers/schema';

export const schema = z.object({
  rawgId: z.number().int().positive("RAWG ID must be a positive integer."),
  status: z.enum(GameStatusArrayValues).optional().default("backlog"),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Games>;

export const postGamesImportFromRawg = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/api/games/import_from_rawg`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
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