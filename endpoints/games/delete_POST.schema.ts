import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({
  gameId: z.number().int().positive("Game ID must be a positive integer."),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  success: boolean;
};

export const postGamesDelete = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/games/delete`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    try {
      const errorText = await result.text();
      const errorObject = superjson.parse(errorText);
      const errorMessage = (errorObject && typeof errorObject === 'object' && 'error' in errorObject) 
        ? (errorObject as { error: string }).error 
        : `HTTP ${result.status}: ${result.statusText}`;
      throw new Error(errorMessage);
    } catch (parseError) {
      // If parsing fails, use the status text as fallback
      throw new Error(`HTTP ${result.status}: ${result.statusText}`);
    }
  }
  return superjson.parse<OutputType>(await result.text());
};