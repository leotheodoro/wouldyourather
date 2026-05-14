import { createTRPCRouter } from './init'
import { shareRouter } from './routers/share'

export const appRouter = createTRPCRouter({
  share: shareRouter,
})
export type AppRouter = typeof appRouter
