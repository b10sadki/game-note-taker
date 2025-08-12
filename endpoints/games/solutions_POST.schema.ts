import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import type { Solutions } from '../../helpers/schema';

export const schema = z.object({
  gameId: z.number().int().positive(),
  problem: z.string().min(1, "Problem is required."),
  solution: z.string().min(1, "Solution is required."),
  aiGenerated: z.boolean().optional().default(false),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Solutions>;

export const postGamesSolutions = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/api/games/solutions`, {
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