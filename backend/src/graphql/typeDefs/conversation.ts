import gql from "graphql-tag";

const typeDefs = gql`
  # graphql does not support date type out of the box
  scalar Date
  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]): CreatConversationResponse
  }

  type Subscription {
    conversationCreated: Conversation
  }

  type CreatConversationResponse {
    conversationId: String
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }
`;

export default typeDefs;
