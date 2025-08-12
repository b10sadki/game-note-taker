import { supabaseDb } from "../../helpers/supabase-db";
import { schema, OutputType } from "./solutions_DELETE.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    console.log("DELETE solutions endpoint called");
    const requestText = await request.text();
    console.log("Request body:", requestText);
    
    const json = superjson.parse(requestText);
    console.log("Parsed JSON:", json);
    
    const input = schema.parse(json);
    console.log("Validated input:", input);

    const result = await supabaseDb.solutions.delete(input.solutionId);
    console.log("Delete result:", result);

    return new Response(superjson.stringify(result satisfies OutputType), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error deleting solution:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}