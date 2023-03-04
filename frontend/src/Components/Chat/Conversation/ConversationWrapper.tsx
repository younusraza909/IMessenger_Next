import {
  gql,
  OperationVariables,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import {
  ConversationData,
  ConversationDeletedData,
  ConversationsData,
  ConversationUpdatedData,
} from "@/src/util/types";
import {
  ConversationPopulated,
  ParticipantPopulated,
} from "@/../backend/src/util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonLoader from "../../common/SkeletonLoader";

interface ConversationWrapperProps {
  session: Session;
}

interface ConversationQueryVariables extends OperationVariables {
  variables: null;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const router = useRouter();

  const {
    user: { id: userId },
  } = session;

  const {
    query: { conversationId },
  } = router;

  // Use Query
  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationData, ConversationQueryVariables>(
    ConversationOperations.Queries.conversation
  );

  // Use Mutation
  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: true },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  // Use Seubscription
  useSubscription<ConversationUpdatedData, null>(
    ConversationOperations.Subscription.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation: updatedConversation },
        } = subscriptionData;

        const currentlyViewinigConversation =
          updatedConversation.id === conversationId;

        if (currentlyViewinigConversation) {
          onViewConversation(conversationId, false);
        }
      },
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    router.push({ query: { conversationId } });

    /**
     * Only mark as read if conversation is unread
     */
    if (hasSeenLatestMessage) return;

    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants
           * from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          /**
           * Create copy to
           * allow mutation
           */
          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          /**
           * Should always be found
           * but just in case
           */
          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update user to show latest
           * message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipants on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.log("onViewConversation error", error);
    }
  };

  const subscribeToMoreConversation = () => {
    subscribeToMore({
      document: ConversationOperations.Subscription.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        console.log("Prev Conversation", prev);
        console.log("subscriptionData1", subscriptionData);
        if (!subscriptionData.data) return prev;

        console.log("subscriptionData2", subscriptionData);

        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useSubscription<ConversationDeletedData, null>(
    ConversationOperations.Subscription.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversation,
        });

        if (!existing) return;

        const { conversations } = existing;
        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversation,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        });
      },
    }
  );

  useEffect(() => {
    subscribeToMoreConversation();
  }, []);
  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      bg="whiteAlpha.50"
      gap={4}
      flexDirection="column"
      py={6}
      px={3}
    >
      {conversationLoading ? (
        <SkeletonLoader count={7} height="80px" />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};

export default ConversationWrapper;
