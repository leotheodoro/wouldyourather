import "server-only";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { archetypeProfileSchema, historyItemSchema } from "@/lib/ai/validation";
import { sharedProfiles } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../init";

export const shareRouter = createTRPCRouter({
  saveProfile: publicProcedure
    .input(
      z.object({
        profile: archetypeProfileSchema,
        history: z.array(historyItemSchema).max(7),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .insert(sharedProfiles)
        .values({ profile: input.profile, history: input.history })
        .returning({ id: sharedProfiles.id });
      if (!row)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed",
        });
      return { id: row.id };
    }),

  getProfile: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select()
        .from(sharedProfiles)
        .where(eq(sharedProfiles.id, input.id));
      if (!row)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Perfil não encontrado",
        });
      return { profile: row.profile, history: row.history };
    }),
});
