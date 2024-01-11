import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
  type Query {
    allUsers: [User]
    oneUser(id: Int): User
  }

  type User {
    id: Int
    name: String
  }

  type Mutation {
    addUser(id: Int, name: String): User
  }
`;