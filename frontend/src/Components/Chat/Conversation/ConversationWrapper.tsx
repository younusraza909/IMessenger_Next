import { OperationVariables, useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationData } from "@/src/util/types";

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
  } = useQuery<ConversationData, ConversationQueryVariables>(
    ConversationOperations.Queries.conversation
  );

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
