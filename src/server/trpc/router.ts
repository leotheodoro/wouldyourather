import { createTRPCRouter } from './init';

export const appRouter = createTRPCRouter({
  // Register feature routers here:
  // example: exampleRouter,
});

export type AppRouter = typeof appRouter;
