import { supabaseDb } from "../helpers/supabase-db";
import { schema, OutputType } from "./games_POST.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newGame = await supabaseDb.games.create({
      name: input.name,
      description: input.description,
      image_url: input.imageUrl,
      status: input.status || 'backlog',
    });

    return new Response(superjson.stringify(newGame satisfies OutputType), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating game:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}