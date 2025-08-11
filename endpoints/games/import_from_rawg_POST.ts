import { db } from "../../helpers/db";
import { schema, OutputType } from "./import_from_rawg_POST.schema";
import superjson from 'superjson';
import { sql } from 'kysely';

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

    const existingGame = await db
      .selectFrom('games')
      .where('rawgId', '=', rawgId)
      .select('id')
      .executeTakeFirst();

    if (existingGame) {
      // Game already exists, maybe we should just return it or update it.
      // For now, let's throw an error to prevent duplicates.
      return new Response(superjson.stringify({ error: `Game with RAWG ID ${rawgId} has already been imported.` }), { status: 409 });
    }

    const gameDetails = await getRawgGameDetails(rawgId, RAWG_API_KEY);

    const newGame = await db
      .insertInto('games')
      .values({
        name: gameDetails.name,
        slug: gameDetails.slug,
        description: gameDetails.description_raw,
        released: gameDetails.released ? new Date(gameDetails.released) : null,
        backgroundImage: gameDetails.background_image,
        imageUrl: gameDetails.background_image, // Using background_image for imageUrl as well
        rating: gameDetails.rating,
        platforms: gameDetails.platforms?.map((p: any) => p.platform.name) ?? [],
        genres: gameDetails.genres?.map((g: any) => g.name) ?? [],
        developers: gameDetails.developers?.map((d: any) => d.name) ?? [],
        publishers: gameDetails.publishers?.map((p: any) => p.name) ?? [],
        rawgId: gameDetails.id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

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