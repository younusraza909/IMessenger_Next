import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { PubSub } from "graphql-subscriptions";
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversation";
import { Context } from "graphql-ws/lib/server";
/**
 * Server Configuration
 */

export interface Session {
  user: User;
  expires: ISODateString;
}

export interface GraphQlContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

/**
 * Users
 */

export interface User {
  id: string;
  image: string;
  email: string;
  name: string;
  username: string;
  emailVerified: boolean;
}
export interface createUsernameResponse {
  success?: boolean;
  error?: string;
}

/**
 * Conversation
 */

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;
