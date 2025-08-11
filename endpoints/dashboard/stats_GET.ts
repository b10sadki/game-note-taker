import { supabaseDb } from "../../helpers/supabase-db";
import { OutputType } from "./stats_GET.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const stats = await supabaseDb.getDashboardStats();

    const output: OutputType = stats;

    return new Response(superjson.stringify(output), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: `Failed to fetch dashboard stats: ${errorMessage}` }), { status: 500 });
  }
}