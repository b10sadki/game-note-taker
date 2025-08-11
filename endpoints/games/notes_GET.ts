import { db } from "../../helpers/db";
import { schema, OutputType } from "./notes_GET.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const input = schema.parse({
      gameId: url.searchParams.get('gameId'),
    });

    const notes = await db
      .selectFrom('notes')
      .selectAll()
      .where('gameId', '=', input.gameId)
      .orderBy('createdAt', 'desc')
      .execute();

    return new Response(superjson.stringify(notes satisfies OutputType), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching game notes:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}