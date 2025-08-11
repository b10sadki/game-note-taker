import { schema, OutputType } from "./rawg_details_POST.schema";
import superjson from 'superjson';

const RAWG_API_URL = "https://api.rawg.io/api";

export async function handle(request: Request) {
  try {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;
    if (!RAWG_API_KEY) {
      throw new Error("RAWG_API_KEY environment variable is not set.");
    }

    const json = superjson.parse(await request.text());
    const { rawgId } = schema.parse(json);

    const detailsUrl = new URL(`${RAWG_API_URL}/games/${rawgId}`);
    detailsUrl.searchParams.append('key', RAWG_API_KEY);

    const apiResponse = await fetch(detailsUrl.toString());

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("RAWG API error:", errorData);
      throw new Error(errorData.detail || `Failed to fetch game details from RAWG API with status: ${apiResponse.status}`);
    }

    const game = await apiResponse.json();

    const result: OutputType = {
      id: game.id,
      name: game.name,
      slug: game.slug,
      description: game.description_raw,
      released: game.released,
      backgroundImage: game.background_image,
      rating: game.rating,
      platforms: game.platforms?.map((p: any) => p.platform.name) ?? [],
      genres: game.genres?.map((g: any) => g.name) ?? [],
      developers: game.developers?.map((d: any) => d.name) ?? [],
      publishers: game.publishers?.map((p: any) => p.name) ?? [],
    };

    return new Response(superjson.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error getting RAWG game details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}