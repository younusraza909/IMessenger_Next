import UserResolvers from "./user";
import ConversationResolvers from "./conversation";
import MessagesResolvers from "./messages";
import merge from "lodash.merge";

const resolvers = merge(
  {},
  UserResolvers,
  MessagesResolvers,
  ConversationResolvers
);

export default resolvers;
