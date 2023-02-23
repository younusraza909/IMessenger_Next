import { ConversationPopulated } from "@/../backend/src/util/types";
import conversation from "@/src/graphql/operations/conversation";
import { Stack, Text } from "@chakra-ui/react";

interface ConversationListProps {
  conversation: ConversationPopulated;
}

const ConversationItem: React.FC<ConversationListProps> = ({
  conversation,
}) => {
  return (
    <Stack p={4} _hover={{ bg: "whiteAlpha.200" }} borderRadius={4}>
      <Text>{conversation.id}</Text>
    </Stack>
  );
};

export default ConversationItem;
