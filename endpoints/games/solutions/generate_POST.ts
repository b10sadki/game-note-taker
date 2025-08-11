import { db } from "../../../helpers/db";
import { schema, OutputType } from "./generate_POST.schema";
import superjson from 'superjson';
import { OpenAI } from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const game = await db
      .selectFrom('games')
      .where('id', '=', input.gameId)
      .select('name')
      .executeTakeFirst();

    if (!game) {
      return new Response(superjson.stringify({ error: "Game not found" }), { status: 404 });
    }

    const prompt = `You are a helpful gaming assistant. A user is playing the game "${game.name}" and is stuck on the following problem. Provide a clear, concise, and step-by-step solution.

Problem: ${input.problem}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedSolution = completion.choices[0]?.message?.content;

    if (!generatedSolution) {
      console.error("OpenAI failed to generate a solution.");
      return new Response(superjson.stringify({ error: "Failed to generate AI solution" }), { status: 500 });
    }

    const newSolution = await db
      .insertInto('solutions')
      .values({
        gameId: input.gameId,
        problem: input.problem,
        solution: generatedSolution,
        aiGenerated: true,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify(newSolution satisfies OutputType), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating AI solution:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}