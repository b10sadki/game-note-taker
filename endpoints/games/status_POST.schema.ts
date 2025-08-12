import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import { Games, GameStatusArrayValues } from '../../helpers/schema';

export const schema = z.object({
  gameId: z.number().int().positive(),
  status: z.enum(GameStatusArrayValues),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Games>;

export const postGamesStatus = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/api/games/status`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorObject = await result.text();
    try {
      const parsedError = superjson.parse(errorObject);
      throw new Error((parsedError as { error: string }).error || "An unknown error occurred");
    } catch (e) {
      // If parsing fails, the error response might not be JSON
      throw new Error(errorObject || "An unknown error occurred");
    }
  }
  return superjson.parse<OutputType>(await result.text());
};