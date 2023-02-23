import { gql } from "apollo-server-core";

const typeDefs = gql`
  type User {
    id: String
    name: String
    email: String
    username: String
    emailVerified: String
    image: String
  }
  type SearchedUser {
    id: String
    username: String
  }

  type Query {
    searchUsers(username: String): [SearchedUser]
  }

  type Mutation {
    createUsername(username: String): createUsernameResponse
  }

  type createUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
