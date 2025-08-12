import { z } from 'zod';
import superjson from 'superjson';

export const schema = z.object({
  solutionId: z.number().int().positive(),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = { success: boolean };

export const deleteGamesSolutions = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/api/games/solutions`, {
    method: "DELETE",
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

  return superjson.parse(await result.text());
};