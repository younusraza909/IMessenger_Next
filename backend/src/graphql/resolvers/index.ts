import UserResolvers from "./user";
import ConversationResolvers from "./conversation";
import merge from "lodash.merge";

const resolvers = merge({}, UserResolvers, ConversationResolvers);

export default resolvers;
