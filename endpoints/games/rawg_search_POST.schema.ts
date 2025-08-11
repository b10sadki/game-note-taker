import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({
  searchQuery: z.string().min(1, "Search query cannot be empty."),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  id: number;
  name: string;
  slug: string;
  backgroundImage: string | null;
  released: string | null; // YYYY-MM-DD format
  rating: number | null;
  platforms: string[];
  genres: string[];
}[];

export const postGamesRawgSearch = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/games/rawg_search`, {
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