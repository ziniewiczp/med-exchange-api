import {
  RegisterUserResponse,
  RegisterUserBody,
  GetUserBody,
  GetUserResponse,
  GetUsersResponse,
  User as TUser,
} from "./userModel.ts";

import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { MongoDB } from "../db/mongo.ts";
import User from "../db/models/User.ts";

const client = new MongoDB();

const allUsers = async (): Promise<GetUsersResponse | undefined> => {
  try {
    await client.connect();
    const users = await User.find({}) as TUser[];
    console.log(users.map(({ password, ...rest}) => ({ ...rest })))
    return users.map(({ email, id, createdAt, updatedAt }) => ({
      id,
      email,
      createdAt,
      updatedAt
    }));
  } catch (e) {
    console.log(e);
  }
};

const oneUser = async ({ id }: GetUserBody): Promise<GetUserResponse | undefined> => {
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
};

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
    register: (_: any, args: RegisterUserBody) => register(args),
  },
};