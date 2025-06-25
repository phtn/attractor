// lib/trpc/routers/webhooks.ts
import { z } from "zod";
import { p, r } from "@/trpc/init";
import { webhookStore } from "@/lib/webhooks/store";

const GetEventsSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  eventType: z.string().optional(),
  isValid: z.boolean().optional(),
});
export type GetEventsParams = z.infer<typeof GetEventsSchema>;

export const GetEventStats = z.object({
  total: z.number(),
  valid: z.number(),
  invalid: z.number(),
  recentHour: z.number(),
  dailyTotal: z.number(),
  successRate: z.number(),
  eventTypes: z.record(z.string(), z.number()).or(z.undefined()),
});
export type EventStatistics = z.infer<typeof GetEventStats>;

export const webhooksRouter = r({
  // Get all webhook events
  getEvents: p.input(GetEventsSchema).query(({ input }) => {
    let events = webhookStore.getEvents();

    // Filter by event type if provided
    if (input.eventType) {
      events = events.filter((event) => event.eventType === input.eventType);
    }

    // Filter by validity if provided
    if (input.isValid !== undefined) {
      events = events.filter((event) => event.isValid === input.isValid);
    }

    // Apply limit
    return events.slice(0, input.limit);
  }),

  // Get webhook statistics
  getStats: p.query(() => {
    const events = webhookStore.getEvents();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentEvents = events.filter(
      (event) => new Date(event.timestamp) > oneHourAgo,
    );

    const dailyEvents = events.filter(
      (event) => new Date(event.timestamp) > oneDayAgo,
    );

    const eventTypes = events.reduce(
      (acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const validEvents = events.filter((event) => event.isValid);
    const invalidEvents = events.filter((event) => !event.isValid);

    return {
      total: events.length ?? 0,
      valid: validEvents.length ?? 0,
      invalid: invalidEvents.length ?? 0,
      recentHour: recentEvents.length ?? 0,
      dailyTotal: dailyEvents.length ?? 0,
      eventTypes,
      successRate:
        events.length > 0 ? (validEvents.length / events.length) * 100 : 0,
    } as EventStatistics;
  }),

  // Get events by repository
  getEventsByRepository: p
    .input(
      z.object({
        repository: z.string(),
        limit: z.number().min(1).max(50).default(20),
      }),
    )
    .query(({ input }) => {
      const events = webhookStore
        .getEvents()
        .filter((event) => event.repository === input.repository)
        .slice(0, input.limit);

      return events;
    }),

  // Clear webhook events (admin function)
  clearEvents: p.mutation(() => {
    // Note: You'd need to add a clear method to your webhook store
    // For now, this is a placeholder
    return { success: true, message: "Events cleared" };
  }),
});
