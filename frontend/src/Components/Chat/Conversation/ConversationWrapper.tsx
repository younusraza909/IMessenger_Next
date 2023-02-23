import { OperationVariables, useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationData } from "@/src/util/types";
import { ConversationPopulated } from "@/../backend/src/util/types";
import { useEffect } from "react";

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
    loading: conversationLoadin,
    subscribeToMore,
  } = useQuery<ConversationData, ConversationQueryVariables>(
    ConversationOperations.Queries.conversation
  );

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
        if (!subscriptionData.data) return prev;

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

  console.log("Here is the data", conversationData);
  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      <ConversationList
        session={session}
        conversations={conversationData?.conversations || []}
      />
    </Box>
  );
};

export default ConversationWrapper;
