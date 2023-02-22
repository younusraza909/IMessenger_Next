import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  Stack,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";
import {
  SearchedUser,
  SearchUsersData,
  SearchUsersInput,
  CreateConversationData,
  CreateConversationInput,
} from "@/src/util/types";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";
import toast from "react-hot-toast";
import { Session } from "next-auth";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const {
    user: { id: userId },
  } = session;
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  // useQuery fires as soon as component renders
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationOperations.Mutations.createConversation
    );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers({ variables: { username } });
  };

  const addParticipants = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipants = (id: string) => {
    setParticipants((prev) =>
      prev.filter((participant) => participant.id !== id)
    );
  };

  const onCreateConversation = async () => {
    const participantIds = [
      userId,
      ...participants.map((participant) => participant.id),
    ];
    try {
      // Call the mutation

      const { data } = await createConversation({
        variables: { participantIds },
      });

      console.log("Here is the data ", data);
    } catch (error: any) {
      console.log("on Create conversation error", error);
      toast.error(error?.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  type="submit"
                  isDisabled={!username}
                  isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data?.searchUsers}
                addParticipants={addParticipants}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipants={removeParticipants}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: "brand.100" }}
                  onClick={onCreateConversation}
                  isLoading={createConversationLoading}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
