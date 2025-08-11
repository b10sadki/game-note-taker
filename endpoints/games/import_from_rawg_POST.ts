import { supabaseDb } from "../../helpers/supabase-db";
import { supabase } from "../../helpers/supabase";
import { schema, OutputType } from "./import_from_rawg_POST.schema";
import superjson from 'superjson';

const RAWG_API_URL = "https://api.rawg.io/api";

async function getRawgGameDetails(rawgId: number, apiKey: string) {
  const detailsUrl = new URL(`${RAWG_API_URL}/games/${rawgId}`);
  detailsUrl.searchParams.append('key', apiKey);

  const apiResponse = await fetch(detailsUrl.toString());

  if (!apiResponse.ok) {
    const errorData = await apiResponse.json();
    console.error("RAWG API error during import:", errorData);
    throw new Error(errorData.detail || `Failed to fetch game details from RAWG API with status: ${apiResponse.status}`);
  }

  return apiResponse.json();
}

export async function handle(request: Request) {
  try {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;
    if (!RAWG_API_KEY) {
      throw new Error("RAWG_API_KEY environment variable is not set.");
    }

    const json = superjson.parse(await request.text());
    const { rawgId } = schema.parse(json);

    // Check if game already exists
    try {
      const { data: existingGames } = await supabase
        .from('games')
        .select('id')
        .eq('rawg_id', rawgId)
        .limit(1);
      
      if (existingGames && existingGames.length > 0) {
        return new Response(superjson.stringify({ error: `Game with RAWG ID ${rawgId} has already been imported.` }), { status: 409 });
      }
    } catch (error) {
      console.error('Error checking existing game:', error);
    }

    const gameDetails = await getRawgGameDetails(rawgId, RAWG_API_KEY);

    const newGame = await supabaseDb.games.create({
      title: gameDetails.name,
      description: gameDetails.description_raw,
      release_date: gameDetails.released ? gameDetails.released : null,
      image_url: gameDetails.background_image || null,
      rating: gameDetails.rating,
      platform: gameDetails.platforms?.map((p: any) => p.platform.name).join(', ') ?? null,
      genre: gameDetails.genres?.map((g: any) => g.name).join(', ') ?? null,
      rawg_id: gameDetails.id,
      status: 'not_started'
    });

    return new Response(superjson.stringify(newGame satisfies OutputType), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error importing game from RAWG:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    // Distinguish between conflict and other errors
    if (error instanceof Error && error.message.includes('duplicate key value violates unique constraint')) {
        return new Response(superjson.stringify({ error: "This game has already been imported." }), { status: 409 });
    }
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}