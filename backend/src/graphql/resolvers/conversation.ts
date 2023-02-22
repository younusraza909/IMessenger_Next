import { GraphQlContext } from "../../util/types";
import { ApolloError } from "apollo-server-core";

const resolvers = {
  Query: {},
  Mutation: {
    createConversation: async (
      _,
      args: { participantIds: [String] },
      context: GraphQlContext
    ) => {
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
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
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
          },
        });
      } catch (error) {
        console.log("Create Conversation Error", error);
        throw new ApolloError("Error creating conversation");
      }
    },
  },
};

export default resolvers;
