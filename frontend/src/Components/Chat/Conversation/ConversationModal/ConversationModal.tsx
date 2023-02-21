import { useLazyQuery } from "@apollo/client";
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
import { SearchUsersData, SearchUsersInput } from "@/src/util/types";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  // useQuery fires as soon as component renders
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers({ variables: { username } });
    // Search User Query
  };

  console.log("data", data);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Modal Title</ModalHeader>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
