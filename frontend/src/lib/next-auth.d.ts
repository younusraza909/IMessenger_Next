import "next-auth";

// We are overwriting types defination

declare module "next-auth" {
  interface Session {
    user: User;
  }
  interface User {
    id: string;
    username: string;
  }
}
