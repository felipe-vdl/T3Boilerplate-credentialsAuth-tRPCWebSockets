import { appRouter } from "@/server/api/root";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { prisma } from "@/server/db";
import { env } from "@/env.mjs";
import ws from "ws";

const wss = new ws.Server({
  port: +env.NEXT_PUBLIC_WSS_PORT,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: ({ req, res }) => {
    return { prisma, session: null };
  },
});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log(
  `✅ WebSocket Server listening on ws://localhost:${env.NEXT_PUBLIC_WSS_PORT}`
);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
