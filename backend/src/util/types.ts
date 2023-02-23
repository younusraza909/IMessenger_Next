import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversation";

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
  email: string;
  name: string;
  username: string;
  emailVerified: boolean;
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

/**
 * Conversation
 */

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;
