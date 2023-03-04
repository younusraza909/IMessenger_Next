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

  type Mutation {
    markConversationAsRead(conversationId: String!, userId: String!): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
  }

  type Subscription {
    conversationUpdated: conversationUpdatedSubscriptionPayload
  }

  type CreatConversationResponse {
    conversationId: String
  }

  type conversationUpdatedSubscriptionPayload {
    conversation: Conversation
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
