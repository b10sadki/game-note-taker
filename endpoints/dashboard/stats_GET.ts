import { db } from "../../helpers/db";
import { OutputType } from "./stats_GET.schema";
import superjson from 'superjson';
import { GameStatusArrayValues } from "../../helpers/schema";

export async function handle(request: Request) {
  try {
    const gameStatsPromise = db.selectFrom('games')
      .select(eb => [
        eb.fn.countAll().as('totalGames'),
        ...GameStatusArrayValues.map(status =>
          eb.fn.countAll().filterWhere('status', '=', status).as(status)
        )
      ])
      .executeTakeFirst();

    const notesCountPromise = db.selectFrom('notes')
      .select(eb => eb.fn.countAll().as('count'))
      .executeTakeFirst();

    const solutionsCountPromise = db.selectFrom('solutions')
      .select(eb => eb.fn.countAll().as('count'))
      .executeTakeFirst();

    const [gameStats, notesCountResult, solutionsCountResult] = await Promise.all([
      gameStatsPromise,
      notesCountPromise,
      solutionsCountPromise,
    ]);

    const totalGames = Number(gameStats?.totalGames ?? 0);
    const totalNotes = Number(notesCountResult?.count ?? 0);
    const totalSolutions = Number(solutionsCountResult?.count ?? 0);

    const gamesByStatus = {
      backlog: Number(gameStats?.backlog ?? 0),
      in_progress: Number(gameStats?.in_progress ?? 0),
      completed: Number(gameStats?.completed ?? 0),
      abandoned: Number(gameStats?.abandoned ?? 0),
    };

    const output: OutputType = {
      totalGames,
      gamesByStatus,
      totalNotes,
      totalSolutions,
      avgNotesPerGame: totalGames > 0 ? totalNotes / totalGames : 0,
      avgSolutionsPerGame: totalGames > 0 ? totalSolutions / totalGames : 0,
    };

    return new Response(superjson.stringify(output), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: `Failed to fetch dashboard stats: ${errorMessage}` }), { status: 500 });
  }
}