import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    ScanCommand
} from "https://esm.sh/@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: "eu-north-1",
    credentials: {
        accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
    },
});

const allUsers = async () => {
    try {
        const response = await client.send(
            new ScanCommand({
                TableName: "Users",
            })
        );

        if (response?.Items) {
            return response.Items.map((item: any) => {
                return { id: item.id.N, name: item.name.S }
            });

        } else {
            throw new Error('Received undefined result from the database');
        }
    } catch (error) {
        console.error(error);
    }
};

const oneUser = async (args: any) => {
    try {
        const { Item } = await client.send(
            new GetItemCommand({
                TableName: "Users",
                Key: {
                    id: { N: `${args.id}` },
                },
            }),
        );

        if (Item) {
            return {
                id: Item.id.N,
                name: Item.name.S
            };

        } else {
            throw new Error('Received undefined result from the database')
        }
    } catch (error) {
        console.error(error);
    }
};

const addUser = async (args: any) => {
    try {
        const {
            $metadata: { httpStatusCode },
        } = await client.send(
            new PutItemCommand({
                TableName: "Users",
                Item: {
                    id: { N: `${args.id}` },
                    name: { S: args.name }
                },
            }),
        );

        // On a successful put item request, dynamo returns a 200 status code (weird).
        // So we test status code to verify if the data has been inserted and respond
        // with the data provided by the request as a confirmation.
        if (httpStatusCode === 200) {
            return JSON.stringify({ status: 201 });
        }

    } catch (error) {
        console.error(error);
    }
}

export const resolvers = {
    Query: {
        allUsers: () => allUsers(),
        oneUser: (_: any, args: any) => oneUser(args),
    },
    Mutation: {
        addUser: (_: any, args: any) => addUser(args),
    },
};