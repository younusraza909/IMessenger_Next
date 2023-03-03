import { MessagesData, SendMessageVariables } from "@/src/util/types";
import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { ObjectId } from "bson";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [messageBody, setMessageBody] = useState("");

  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageVariables
  >(MessageOperations.Mutations.sendMessage);

  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // call send Message Mutation
      const { id: senderId } = session.user;
      const newId = new ObjectId().toString();
      const newMessage: SendMessageVariables = {
        id: newId,
        senderId,
        conversationId,
        body: messageBody,
      };

      setMessageBody('');
      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true
        },
        //Due to optimistic rendering this function fire immediately after mutation is called
        // else it is called after is get success from server
        update: (cache) => {

          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: newId,
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });

        }
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Error sending message");
      }
    } catch (error: any) {
      console.log("On send message Error", error);
      toast.error(error.message);
    }
  };

  return (
    <Box px={4} width="100%">
      <form onSubmit={onSendMessage}>
        <Input
          placeholder="New Message"
          size="md"
          resize="none"
          value={messageBody}
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
