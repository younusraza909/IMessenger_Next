import {
  ConversationPopulated,
  ParticipantPopulated,
} from "@/../backend/src/util/types";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./ConversationModal/ConversationModal";

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  onViewConversation,
  conversations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const {
    user: { id: userId },
  } = session;

  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session} />

      {conversations.map((conv) => {
        let participants = conv.participants.find(
          (p: ParticipantPopulated) => p.user.id === userId
        );

        return (
          <ConversationItem
            conversation={conv}
            key={conv.id}
            onClick={() =>
              onViewConversation(conv.id, participants.hasSeenLatestMessage)
            }
            hasSeenLatestMessage={participants.hasSeenLatestMessage}
            isSelected={conv.id === router.query.conversationId}
            userId={userId}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
