import { gql } from "$graphqltagmod.ts";

export const typeDefs = gql`
    enum Status {
        FINISHED,
        PENDING,
        CANCELED,
        FOUND
    }
    
    type User {
        id: String!,
        email: String!,
        updatedAt: String!,
        createdAt: String!,
        password: String,
    }
    
    type EmailAlreadyUsed {
        message: String!
    }
    
    union UserResult = User | EmailAlreadyUsed

    type Replacement {
        id: ID,
        startDate: String,
        endDate: String,
        status: Status,
        numberOfEmployees: Int,
        ownerId: Int,
    }

    type Mutation {
        addUser(id: Int, email: String): User
        register(email: String, password: String): UserResult!
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
        oneUser(id: String): User
        replacements: [Replacement]
        replacement(id: Int): Replacement
    }
`;


// mutation Register($email: String!, $password: String!) {
//     register(email: $email, password: $password) {
//     ... on EmailAlreadyUsed {
//             message
//         }
//     ... on User {
//             id
//         }}
// }