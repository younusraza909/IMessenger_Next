import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

/**
 * Users
 */

export interface Session {
  user: User;
  expires: ISODateString;
}

export interface User {
  id: string;
  image: string;
  username: string;
}
export interface createUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface GraphQlContext {
  session: Session | null;
  prisma: PrismaClient;
  // pubsub
}
