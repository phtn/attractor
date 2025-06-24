import { p, r } from "@/trpc/init";
import { z } from "zod";
const HelloSchema = z.object({
  text: z.string(),
});

export type HelloParams = z.infer<typeof HelloSchema>;
export const greetRouter = r({
  hello: p.input(HelloSchema).query(async ({ input }) => input),
});
