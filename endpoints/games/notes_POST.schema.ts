import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import type { Notes } from '../../helpers/schema';

export const schema = z.object({
  gameId: z.number().int().positive(),
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Notes>;

export const postGamesNotes = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/api/games/notes`, {
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