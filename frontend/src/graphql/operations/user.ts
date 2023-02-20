import { gql } from "@apollo/client";

export default {
  Queries: {},
  Mutations: {
    createusername: gql`
      mutation CreateUserName($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscription: {},
};
