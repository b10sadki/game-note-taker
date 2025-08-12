import { supabaseDb } from "../../helpers/supabase-db";
import { schema, OutputType } from "./solutions_GET.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const input = schema.parse({
      gameId: url.searchParams.get('gameId'),
    });

    const solutions = await supabaseDb.solutions.findByGameId(input.gameId);

    return new Response(superjson.stringify(solutions satisfies OutputType), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching game solutions:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}