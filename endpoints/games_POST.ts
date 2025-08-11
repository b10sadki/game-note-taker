import { db } from "../helpers/db";
import { schema, OutputType } from "./games_POST.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newGame = await db
      .insertInto('games')
      .values({
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        status: input.status || 'backlog',
      })
      .returningAll()
      .executeTakeFirstOrThrow();

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