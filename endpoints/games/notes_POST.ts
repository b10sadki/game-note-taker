import { supabaseDb } from "../../helpers/supabase-db";
import { schema, OutputType } from "./notes_POST.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newNote = await supabaseDb.notes.create({
      game_id: input.gameId,
      content: input.content,
    });

    return new Response(superjson.stringify(newNote satisfies OutputType), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating game note:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}