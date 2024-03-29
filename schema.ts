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


    type SuccessfulAuthentication {
        token: String!
    }

    type FailedAuthentication {
        message: String!
    }
    
    union LoginResult = SuccessfulAuthentication | FailedAuthentication

    type Replacement {
        id: String!,
        startDate: String!,
        endDate: String!,
        status: Status!,
        numberOfEmployees: Int,
        ownerId: Int!,
    }

    type Mutation {
        register(email: String, password: String): UserResult!
        login(email: String, password: String): LoginResult!
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