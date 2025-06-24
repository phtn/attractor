import { trpc } from "@/trpc/server";
import { GetEventsParams } from "../routers/webhooks";

export const webhooks = {
  getEvents: async (params: GetEventsParams) => await trpc.getEvents(params),
};
