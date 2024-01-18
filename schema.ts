import { gql } from "$graphqltagmod.ts";

export const typeDefs = gql`
    enum Status {
        FINISHED,
        PENDING,
        CANCELED,
        FOUND
    }
    
    type User {
        id: Int
        name: String
    }

    type Replacement {
        id: ID,
        startDate: String,
        endDate: String,
        status: Status,
        numberOfEmployees: Int
    }

    type Mutation {
        addUser(id: Int, name: String): User
        addReplacement(
            id: Int, 
            startDate: String, 
            endDate: String, 
            status: Status, 
            numberOfEmployees: Int
        ): Replacement
    }

    type Query {
        allUsers: [User]
        oneUser(id: Int): User
        replacements: [Replacement]
        replacement(id: Int): Replacement
    }
`;