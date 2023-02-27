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
