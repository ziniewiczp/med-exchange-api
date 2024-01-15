import { resolvers as UserResolvers } from "./users.ts";

export const resolvers = {
    Query: {
        ...UserResolvers.Query
    },
    Mutation: {
        ...UserResolvers.Mutation
    },
};