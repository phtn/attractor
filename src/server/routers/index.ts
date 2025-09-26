import { m } from '@/trpc/init'
import { greetRouter } from '@/server/routers/greet'
import { webhooksRouter as webhooks } from '@/server/routers/webhooks'

export const merged = m(greetRouter, webhooks)

export type AppRouter = typeof merged
