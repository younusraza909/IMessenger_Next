import { gql } from "@apollo/client";

const ConversationFields = `
conversations {
  id
  participants {
    user {
      id
      username
    }
    hasSeenLatestMessage
  }
  latestMessage {
    id
    sender {
      id
      username
    }
    body
    createdAt
  }
  updatedAt
}
`;
export default {
  Queries: {
    conversation: gql`
      query Conversation {
        ${ConversationFields}
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
  },
  Subscription: {
    conversationCreated: gql`
    subscription ConversationCreated{
      conversationCreated{
        ${ConversationFields}
      }
    }`,
  },
};
