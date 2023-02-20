import { GraphQlContext } from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: (
      _: any,
      args: { username: string },
      context: GraphQlContext
    ) => {
      const { username } = args;

      const { session, prisma } = context;
    },
  },
};

export default resolvers;
