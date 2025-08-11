import { schema, OutputType } from "./rawg_search_POST.schema";
import superjson from 'superjson';

const RAWG_API_URL = "https://api.rawg.io/api";

export async function handle(request: Request) {
  try {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;
    if (!RAWG_API_KEY) {
      throw new Error("RAWG_API_KEY environment variable is not set.");
    }

    const json = superjson.parse(await request.text());
    const { searchQuery } = schema.parse(json);

    const searchUrl = new URL(`${RAWG_API_URL}/games`);
    searchUrl.searchParams.append('key', RAWG_API_KEY);
    searchUrl.searchParams.append('search', searchQuery);
    searchUrl.searchParams.append('page_size', '10'); // Limit to 10 results for now

    const apiResponse = await fetch(searchUrl.toString());

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("RAWG API error:", errorData);
      throw new Error(errorData.detail || `Failed to fetch from RAWG API with status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    const results: OutputType = data.results.map((game: any) => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      backgroundImage: game.background_image,
      released: game.released,
      rating: game.rating,
      platforms: game.platforms?.map((p: any) => p.platform.name) ?? [],
      genres: game.genres?.map((g: any) => g.name) ?? [],
    }));

    return new Response(superjson.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error searching RAWG games:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}