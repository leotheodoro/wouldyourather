import { initTRPC, StandardSchemaV1Error } from "@trpc/server";
import { cache } from "react";
import { db } from "../db";

export const createTRPCContext = cache(async () => {
  return { db };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter: ({ shape, error }) => {
    const cause = error.cause;
    let zodError: {
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    } | null = null;

    if (cause instanceof StandardSchemaV1Error) {
      const formErrors: string[] = [];
      const fieldErrors: Record<string, string[]> = {};

      for (const issue of cause.issues) {
        const path = issue.path;
        if (!path || path.length === 0) {
          formErrors.push(issue.message);
        } else {
          const key = String(
            typeof path[0] === "object" && path[0] !== null && "key" in path[0]
              ? path[0].key
              : path[0],
          );
          if (!fieldErrors[key]) {
            fieldErrors[key] = [];
          }
          fieldErrors[key].push(issue.message);
        }
      }

      zodError = { formErrors, fieldErrors };
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
