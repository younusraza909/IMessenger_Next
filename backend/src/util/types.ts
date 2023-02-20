import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";

export interface GraphQlContext {
  session: Session | null;
  prisma: PrismaClient;
  // pubsub
}
