import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [messageBody, setMessageBody] = useState("");
  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // call send Message Mutation
    } catch (error: any) {
      console.log("On send message Error", error);
      toast.error(error.message);
    }
  };

  return (
    <Box px={4} width="100%">
      Here is the input
      <form onSubmit={() => {}}>
        <Input
          placeholder="New Message"
          size="md"
          resize="none"
          onChange={(e) => setMessageBody(e.target.value)}
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAlpha.300",
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
