import { Flex } from "@chakra-ui/react";

interface MessagesProps {}

const Message: React.FC<MessagesProps> = () => {
  return <Flex direction="column" justify="flex-end" overflow="hidden"></Flex>;
};

export default Message;
