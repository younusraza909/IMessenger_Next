import SkeletonLoader from "@/src/Components/common/SkeletonLoader";
import { MessagesData, MessagesVariables } from "@/src/util/types";
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Message: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            // <MessageItem
            //   key={message.id}
            //   message={message}
            //   sentByMe={message.sender.id === userId}
            // />
            <div>{message?.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Message;
