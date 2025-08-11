import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import type { Games, GameStatus } from '../helpers/schema';
import { GameStatusArrayValues } from '../helpers/schema';

export const schema = z.object({
  name: z.string().min(1, "Game name is required."),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL.").optional(),
  status: z.enum(GameStatusArrayValues).optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Games>;

export const postGames = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/games`, {
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