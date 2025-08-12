import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({
  rawgId: z.number().int().positive("RAWG ID must be a positive integer."),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  released: string | null; // YYYY-MM-DD format
  backgroundImage: string | null;
  rating: number | null;
  platforms: string[];
  genres: string[];
  developers: string[];
  publishers: string[];
};

export const postGamesRawgDetails = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/api/games/rawg_details`, {
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