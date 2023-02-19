import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data } = useSession();
  console.log("Here is the data", data);
  return (
    <div>
      <button onClick={() => signIn("google")}>Sign In</button>
    </div>
  );
};

export default Home;
