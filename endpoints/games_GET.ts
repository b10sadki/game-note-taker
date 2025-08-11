import { db } from "../helpers/db";
import { OutputType } from "./games_GET.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const games = await db
      .selectFrom('games')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .execute();

    return new Response(superjson.stringify(games satisfies OutputType), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}