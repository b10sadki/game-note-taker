import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import type { Games } from '../helpers/schema';

// No input schema for a simple GET all request.
export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Games>[];

export const getGames = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/games`, {
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