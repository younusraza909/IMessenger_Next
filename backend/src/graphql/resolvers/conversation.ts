import { GraphQlContext } from "../../util/types";
import { ApolloError } from "apollo-server-core";
import { Prisma } from "@prisma/client";

const resolvers = {
  Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: [String] },
      context: GraphQlContext
    ): Promise<{ conversationId: String }> => {
      const { session, prisma } = context;
      const { participantIds } = args;

      if (!session?.user) {
        throw new ApolloError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: String(id),
                  hasSeenLatestMessage: id === userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        // emit a CONVERSATION_CREATED event using pub_sub

        return {
          conversationId: conversation.id,
        };
      } catch (error) {
        console.log("Create Conversation Error", error);
        throw new ApolloError("Error creating conversation");
      }
    },
  },
};

// This is not a simple object in prisma after running that generate command it gives us this type
export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default resolvers;
