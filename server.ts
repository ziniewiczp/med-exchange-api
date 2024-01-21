import { Server } from "$stdhttp/server.ts";
import { GraphQLHTTP } from "$gglmod.ts";
import { makeExecutableSchema } from "$graphqltoolsmod.ts";
import { resolvers } from "./resolvers/index.ts";
import { typeDefs } from "./schema.ts";
import cors, { CorsOptions } from "cors";

const schema = makeExecutableSchema({ resolvers, typeDefs });

const server = new Server({
    handler: async (request: Request) => {
        const { pathname } = new URL(request.url);

        const response: Response = (pathname === "/graphql")
            ? await GraphQLHTTP<Request>({
                schema,
                graphiql: true,
              })(request)

            : new Response("Not Found", { status: 404 });

        const frontEndOrigin: string | undefined = Deno.env.get("FRONT_END_ORIGIN");

        const options: CorsOptions = {
            origin: frontEndOrigin === undefined
                ? false
                : new RegExp(frontEndOrigin as string),
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
        };

        return cors(
            request,
            response,
            options
        );
    },
    port: 3000,
});

server.listenAndServe();