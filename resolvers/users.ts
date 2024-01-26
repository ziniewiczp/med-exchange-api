import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand
} from "client_dynamodb";
import { RegisterUserResponse, RegisterUserBody } from "./userModel.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import * as uuid from "https://deno.land/std@0.207.0/uuid/mod.ts";

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
        return { id: item.id.S, email: item.email.S }
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
          id: { S: `${args.id}` },
        },
      }),
    );

    if (Item) {
      return {
        id: Item.id.S,
        email: Item.email.S
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
          id: { S: `${args.id}` },
          email: { S: args.email }
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

const register = async ({ email, password }: RegisterUserBody): Promise<RegisterUserResponse | undefined> => {
  try {
    const users = await client.send(
      new ScanCommand({
        TableName: "Users",
      })
    );

    const isEmailUsed = users?.Items?.find((item: any) => {
      return item.email.S === email
    });

    if (isEmailUsed) {
      return {
        __typename: "EmailAlreadyUsed",
        message: `Email ${email} is already used`
      };
    }

    const hashedPassword = await bcrypt.hash(password);
    const id = uuid.v1.generate() as string;

    const {
      $metadata: { httpStatusCode },
    } = await client.send(
      new PutItemCommand({
        TableName: "Users",
        Item: {
          id: { S: id },
          email: { S: email },
          password: { S: hashedPassword }
        },
      }),
    );

    if (httpStatusCode === 200) {
      return {
        __typename: "User",
        id
      };
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
    register: (_: any, args: RegisterUserBody) => register(args),
  },
};