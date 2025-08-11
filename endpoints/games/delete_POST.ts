import { db } from "../../helpers/db";
import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { Transaction } from "kysely";
import { DB } from "../../helpers/schema";

async function deleteGameAndAssociations(gameId: number, trx: Transaction<DB>) {
  // Delete associated solutions
  await trx
    .deleteFrom('solutions')
    .where('gameId', '=', gameId)
    .execute();

  // Delete associated notes
  await trx
    .deleteFrom('notes')
    .where('gameId', '=', gameId)
    .execute();

  // Delete the game itself
  const deleteResult = await trx
    .deleteFrom('games')
    .where('id', '=', gameId)
    .executeTakeFirst(); // Use executeTakeFirst as we expect to delete at most one row

  // The numDeletedRows is a bigint, so we compare with 0n
  if (deleteResult.numDeletedRows === 0n) {
    throw new Error("Game not found or already deleted.");
  }
}

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const { gameId } = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      await deleteGameAndAssociations(gameId, trx);
    });

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