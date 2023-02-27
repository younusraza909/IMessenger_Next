import {
  GraphQlContext,
  MessagePopulated,
  messageSentSubscriptionPayload,
  SendMessageArguments,
} from "../../util/types";
import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../util/function";
import { conversationPopulated } from "./conversation";

const resolvers = {
  Query: {
    messages: async (
      _: any,
      args: { conversationId: string },
      context: GraphQlContext
    ): Promise<Array<MessagePopulated>> => {
      const { session, prisma } = context;

      const { conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError("Not Authorized");
      }

      const {
        user: { id: userId },
      } = session;

      /**
       * Verify user is the participants
       */

      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulated,
      });

      if (!conversation) {
        throw new GraphQLError("Conversation not found");
      }

      const allowedToView = userIsConversationParticipant(
        conversation.participants,
        userId
      );

      if (!allowedToView) {
        throw new GraphQLError("Not authorized");
      }
      try {
        const messages = prisma.message.findMany({
          where: {
            conversationId,
          },
          include: messagePopulated,
          orderBy: {
            createdAt: "desc",
          },
        });
        return messages;
      } catch (error: any) {
        console.log("Get Message error", error);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    sendMessage: async (
      _: any,
      args: SendMessageArguments,
      context: GraphQlContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        throw new GraphQLError("Not Authorized");
      }

      const {
        user: { id: userId },
      } = session;

      const { id: messageId, senderId, conversationId, body } = args;

      if (userId !== senderId) {
        throw new GraphQLError("Not Authorized");
      }

      try {
        /**
         * Create New Message
         */
        const newMessasge = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body,
          },
          include: messagePopulated,
        });

        /**
         * Find conversation participant entity
         */
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        /**
         * Should always exist
         */
        if (!participant) {
          throw new GraphQLError("Participant does not exist");
        }

        const { id: participantId } = participant;

        /**
         * Update Conversation
         */

        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessasge.id,
            participants: {
              update: {
                where: {
                  id: participantId,
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        pubsub.publish("MESSAGE_SENT", {
          messageSent: newMessasge,
        });

        // pubsub.publish("CONVERSATION_UPDATED", {
        //   conversationUpdated: {
        //     conversation,
        //   },
        // });
      } catch (error) {
        console.log("Send Message Error", error);
        throw new GraphQLError("Error sending message");
      }

      return true;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQlContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator("MESSAGE_SENT");
        },
        (
          payload: messageSentSubscriptionPayload,
          args: { coversationId: String },
          context: GraphQlContext
        ) => {
          return payload.messageSent.conversationId === args.coversationId;
        }
      ),
    },
  },
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});

export default resolvers;
