import { gql } from "$graphqltagmod.ts";

export const typeDefs = gql`
    type User {
        id: Int
        name: String
    }

    type Replacement {
        id: Int
    }

    type Mutation {
        addUser(id: Int, name: String): User
        addReplacement(id: Int): Replacement
    }

    type Query {
        allUsers: [User]
        oneUser(id: Int): User
        allReplacements: [Replacement]
        oneReplacement(id: Int): Replacement
    }
`;