import {RegisterUserResponse, RegisterUserBody, GetUserBody} from "./userModel.ts";

import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { MongoDB } from "../db/mongo.ts";
import User from "../db/models/User.ts";

const client = new MongoDB();

const allUsers = async () => {
  await client.connect();
  const user = new User({
    email: "pfrancza@interia.pl",
    password: "Haslo123"
  });

  console.log(user)

  await user.save();
  console.log('save');
  const userFromMongoDb = await User.findOne({ email: "pfrancza@interia.pl" });
  console.log(
    `Finding User in MongoDB -- \n  ${userFromMongoDb?.email}`,
  );
  // try {
  //   const response = await client.send(
  //     new ScanCommand({
  //       TableName: "Users",
  //     })
  //   );
  //
  //   if (response?.Items) {
  //     return response.Items.map((item: any) => {
  //       return { id: item.id.S, email: item.email.S }
  //     });
  //
  //   } else {
  //     throw new Error('Received undefined result from the database');
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
// 65ba944c9f38851bdc93bea3
const oneUser = async ({ id }: GetUserBody) => {
  try {
    await client.connect();
    const userFromMongoDb = await User.findById(id);
    return {
      email: userFromMongoDb.email,
      id: userFromMongoDb.id,
      createdAt: userFromMongoDb.createdAt,
      updatedAt: userFromMongoDb.updatedAt
    };
  } catch (e) {
    console.log(e);
  }
//   try {
//     const { Item } = await client.send(
//       new GetItemCommand({
//         TableName: "Users",
//         Key: {
//           id: { S: `${args.id}` },
//         },
//       }),
//     );
//
//     if (Item) {
//       return {
//         id: Item.id.S,
//         email: Item.email.S
//       };
//
//     } else {
//       throw new Error('Received undefined result from the database')
//     }
//   } catch (error) {
//     console.error(error);
//   }
};

const addUser = async (args: any) => {
  // try {
  //   const {
  //     $metadata: { httpStatusCode },
  //   } = await client.send(
  //     new PutItemCommand({
  //       TableName: "Users",
  //       Item: {
  //         id: { S: `${args.id}` },
  //         email: { S: args.email }
  //       },
  //     }),
  //   );
  //
  //   // On a successful put item request, dynamo returns a 200 status code (weird).
  //   // So we test status code to verify if the data has been inserted and respond
  //   // with the data provided by the request as a confirmation.
  //   if (httpStatusCode === 200) {
  //     return JSON.stringify({ status: 201 });
  //   }
  //
  // } catch (error) {
  //   console.error(error);
  // }
}

const register = async ({ email, password }: RegisterUserBody): Promise<RegisterUserResponse | undefined> => {
  try {
    await client.connect();

    const userFromMongoDb = await User.findOne({ email });
    const isEmailUsed = !!userFromMongoDb;

    if (isEmailUsed) {
      return {
        __typename: "EmailAlreadyUsed",
        message: `Email ${email} is already used`
      };
    }

    const hashedPassword = await bcrypt.hash(password);

    const user = new User({
      email,
      password: hashedPassword
    });

    const createdUser = await user.save();
    if (createdUser === user) {
      return {
        __typename: "User",
        id: user.id
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