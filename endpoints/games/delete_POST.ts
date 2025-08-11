import { supabaseDb } from "../../helpers/supabase-db";
import { supabase } from "../../helpers/supabase";
import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';

async function deleteGameAndAssociations(gameId: number) {
  // Delete associated solutions
  const { error: solutionsError } = await supabase
    .from('solutions')
    .delete()
    .eq('game_id', gameId);
  
  if (solutionsError) {
    console.error('Error deleting solutions:', solutionsError);
  }

  // Delete associated notes
  const { error: notesError } = await supabase
    .from('notes')
    .delete()
    .eq('game_id', gameId);
  
  if (notesError) {
    console.error('Error deleting notes:', notesError);
  }

  // Delete the game itself
  await supabaseDb.games.delete(gameId);
}

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const { gameId } = schema.parse(json);

    await deleteGameAndAssociations(gameId);

    console.log(`Successfully deleted game with ID: ${gameId} and its associations.`);
    return new Response(superjson.stringify({ success: true } satisfies OutputType), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error deleting game:", error);
    
    let errorMessage: string;
    let statusCode: number;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check if it's a Zod error
      if (error.name === 'ZodError') {
        statusCode = 400;
      } else if (error.message.includes("not found")) {
        statusCode = 404;
      } else {
        statusCode = 500;
      }
    } else {
      errorMessage = "An unknown error occurred";
      statusCode = 500;
    }
    
    return new Response(superjson.stringify({ error: errorMessage }), { status: statusCode });
  }
}