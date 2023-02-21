const resolvers = {
  Query: {},
  Mutation: {
    createConversation: async () => {
      console.log("Create Conversation");
    },
  },
};

export default resolvers;
