import { db } from "../../helpers/db";
import { schema, OutputType } from "./status_POST.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const { gameId, status } = schema.parse(json);

    const updatedGame = await db
      .updateTable('games')
      .set({ status, updatedAt: new Date() })
      .where('id', '=', gameId)
      .returningAll()
      .executeTakeFirst();

    if (!updatedGame) {
      return new Response(superjson.stringify({ error: `Game with ID ${gameId} not found.` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(superjson.stringify(updatedGame satisfies OutputType), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error updating game status:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { 
      status: 400, // Zod errors will fall here, which are client errors.
      headers: { 'Content-Type': 'application/json' },
    });
  }
}