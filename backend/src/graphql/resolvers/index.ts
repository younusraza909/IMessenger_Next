import UserResolvers from "./user";
import ConversationResolvers from "./conversation";
import MessagesResolvers from "./messages";
import ScalarResolvers from "./scalars";
import merge from "lodash.merge";

const resolvers = merge(
  {},
  UserResolvers,
  MessagesResolvers,
  ScalarResolvers,
  ConversationResolvers
);

export default resolvers;
