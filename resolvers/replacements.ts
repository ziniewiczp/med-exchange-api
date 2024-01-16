import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand
} from "client_dynamodb";

const TABLE_NAME = "Replacements";

const client = new DynamoDBClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
  },
});

const allReplacements = async () => {
  try {
    const response = await client.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    if (response?.Items) {
      return response.Items.map((item: any) => {
        return { id: item.id.N }
      });

    } else {
      throw new Error('Received undefined result from the database');
    }
  } catch (error) {
    console.error(error);
  }
};

const oneReplacement = async (args: any) => {
  try {
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: {
          id: { N: `${args.id}` },
        },
      }),
    );

    if (Item) {
      return {
        id: Item.id.N
      };

    } else {
      throw new Error('Received undefined result from the database')
    }
  } catch (error) {
    console.error(error);
  }
};

const addReplacement = async (args: any) => {
  try {
    const {
      $metadata: { httpStatusCode },
    } = await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          id: { N: `${args.id}` },
s        },
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
    allReplacements: () => allReplacements(),
    oneReplacement: (_: any, args: any) => oneReplacement(args),
  },
  Mutation: {
    addReplacement: (_: any, args: any) => addReplacement(args),
  },
};