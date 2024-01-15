import { resolvers as UserResolvers } from "./users.ts";
import { resolvers as ReplacementResolvers } from "./replacements.ts";

export const resolvers = {
    Query: {
        ...UserResolvers.Query,
        ...ReplacementResolvers.Query,
    },
    Mutation: {
        ...UserResolvers.Mutation,
        ...ReplacementResolvers.Mutation,
    },
};