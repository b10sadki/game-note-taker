import { supabaseDb } from "../../helpers/supabase-db";
import { schema, OutputType } from "./solutions_POST.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newSolution = await supabaseDb.solutions.create({
      game_id: input.gameId,
      title: input.problem,
      content: input.solution,
    });

    return new Response(superjson.stringify(newSolution satisfies OutputType), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating game solution:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}