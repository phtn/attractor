'use server'

import { HelloParams } from '@/server/routers/greet'
import { trpc } from '@/trpc/server'

export const greetHello = async (params: HelloParams) =>
  await trpc.hello(params)
