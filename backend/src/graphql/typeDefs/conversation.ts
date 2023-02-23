import { gql } from "apollo-server-core";

const typeDefs = gql`
  # graphql does not support date type out of the box
  scalar Date
  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]): CreatConversationResponse
  }

  type CreatConversationResponse {
    conversationId: String
  }

  type Conversation {
    id: String
    # latestMessage: Message
    participants: [Participant]
    createdAt: Date
    update: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }
`;

export default typeDefs;
