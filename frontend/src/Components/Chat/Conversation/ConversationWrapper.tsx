import { OperationVariables, useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationData } from "@/src/util/types";
import { ConversationPopulated } from "@/../backend/src/util/types";
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
  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationData, ConversationQueryVariables>(
    ConversationOperations.Queries.conversation
  );

  console.log("Query Data", conversationData);

  const router = useRouter();

  const {
    query: { conversationId },
  } = router;

  const onViewConversation = async (conversationId: string) => {
    /**
     * 1 - Push the conversation Id to the next router
     */

    router.push({
      query: {
        conversationId,
      },
    });
    /**
     * 2 -Mark View if not
     */
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
