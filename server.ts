import { Server } from "$stdhttp/server.ts";
import { GraphQLHTTP } from "$gglmod.ts";
import { makeExecutableSchema } from "$graphqltoolsmod.ts";
import { resolvers } from "./resolvers/index.ts";
import { typeDefs } from "./types/index.ts";

const schema = makeExecutableSchema({ resolvers, typeDefs });

const server = new Server({
    handler: async (req: { url: string | URL; }) => {
        const { pathname } = new URL(req.url);

        return pathname === "/graphql"
            ? await GraphQLHTTP<Request>({
                schema,
                graphiql: true,
            })(req)
            : new Response("Not Found", { status: 404 });
    },
    port: 3000,
});

server.listenAndServe();