import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { observable } from "@trpc/server/observable";
import EventEmitter from "events";

export const messageEmitter = new EventEmitter();

export const targetRouter = createTRPCRouter({
  webhookSubscription: publicProcedure.subscription(() => {
    return observable<string>((emit) => {
      const onMessage = (data: string) => {
        emit.next(data);
      };
      messageEmitter.on("message", onMessage);

      return () => {
        messageEmitter.off("message", onMessage);
      };
    });
  }),
  setData: publicProcedure
    .meta({ openapi: { method: "POST", path: "/target" } })
    .input(z.object({ message: z.string() }))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.jsonData.create({
        data: {
          json: JSON.stringify(input.message),
        },
      });
      messageEmitter.emit("message", input.message);

      return { message: "The message was received!" };
    }),
  getData: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.jsonData.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return data;
  }),
});
