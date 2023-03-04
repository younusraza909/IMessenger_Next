import {
  ConversationPopulated,
  ParticipantPopulated,
} from "@/../backend/src/util/types";
import conversation from "@/src/graphql/operations/conversation";
import { useMutation } from "@apollo/client";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
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
  const [deleteConversation] = useMutation<
    { deleteConversation: boolean },
    { conversationId: string }
  >(conversation.Mutations.deleteConversation);

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const {
    user: { id: userId },
  } = session;

  const sortedConversation = [
    ...conversations.sort(
      (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
    ),
  ];

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error) {
      console.log("onDeleteConversation error", error);
    }
  };

  return (
    <Box width="100%" overflow="hidden" position="relative" height="100%">
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

      {sortedConversation.map((conv) => {
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
            onDeleteConversation={onDeleteConversation}
          />
        );
      })}

      <Box
        position="absolute"
        bottom={0}
        left={0}
        width="100%"
        bg="#313131"
        px={8}
        py={6}
        zIndex={1}
      >
        <Button width="100%" onClick={() => signOut()}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationList;
