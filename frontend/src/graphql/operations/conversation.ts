import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
    id
    participants {
      user {
        id
        username
      }
      hasSeenLatestMessage
    }
    latestMessage {
      ${MessageFields}
    }
    updatedAt
`;
export default {
  Queries: {
    conversation: gql`
      query Conversation {
        conversations{
          ${ConversationFields}
        }
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
    markConversationAsRead: gql`
      mutation MarkConversationAsRead(
        $userId: String!
        $conversationId: String!
      ) {
        markConversationAsRead(conversationId: $conversationId, userId: $userId)
      }
    `,

    deleteConversation: gql`
      mutation deleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
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

    conversationUpdated: gql`
  subscription ConversationUpdated {
    conversationUpdated {
      conversation {
        ${ConversationFields}
      }
    }
  }
`,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
  },
};
