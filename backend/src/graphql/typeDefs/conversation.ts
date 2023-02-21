import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Mutation {
    createConversation(participantIds: [String]): CreatConversationResponse
  }

  type CreatConversationResponse {
    conversationId: String
  }
`;

export default typeDefs;
