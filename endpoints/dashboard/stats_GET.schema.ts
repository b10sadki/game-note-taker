import { z } from "zod";
import superjson from 'superjson';
import { GameStatusArrayValues } from "../../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export const GameStatusCountSchema = z.object({
  backlog: z.number(),
  in_progress: z.number(),
  completed: z.number(),
  abandoned: z.number(),
});

export type GameStatusCount = z.infer<typeof GameStatusCountSchema>;

export type OutputType = {
  totalGames: number;
  gamesByStatus: GameStatusCount;
  totalNotes: number;
  totalSolutions: number;
  avgNotesPerGame: number;
  avgSolutionsPerGame: number;
};

export const getDashboardStats = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/api/dashboard/stats`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text());
    throw new Error((errorObject as { error: string }).error);
  }
  return superjson.parse<OutputType>(await result.text());
};