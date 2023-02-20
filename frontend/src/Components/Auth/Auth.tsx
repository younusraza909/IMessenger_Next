import { CreateUsernameData, CreateUsernameVariables } from "@/src/util/types";
import { useMutation } from "@apollo/client";
import { Button, Center, Stack, Text, Image, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import UserOperations from "../../graphql/operations/user";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");

  const [createUsername, { error, loading }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations?.Mutations.createusername);

  const onSubmit = async () => {
    console.log("username", username);
    if (!username) return;
    try {
      let { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data?.createUsername?.error) {
        let {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      toast.success("Username successfully created!");

      reloadSession();
    } catch (err: any) {
      console.log("error", err);
      toast.error(err?.message);
    }
  };
  return (
    <Center height="100vh">
      <Stack spacing={8} align="center">
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button width="100%" onClick={onSubmit} isLoading={loading}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">MessengerQL</Text>
            <Button
              onClick={() => signIn("google")}
              leftIcon={<Image height="20px" src="/images/googlelogo.png" />}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
