import {
  RegisterUserResponse,
  RegisterUserBody,
  GetUserBody,
  GetUserResponse,
  GetUsersResponse,
  User as TUser,
  LoginUserBody,
} from "./userModel.ts";

import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { MongoDB } from "../db/mongo.ts";
import User from "../db/models/User.ts";
import {LoginUserResponse} from "./userModel.ts";
import jwt from 'jwt';

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

const login = async ({ email, password }: LoginUserBody): Promise<LoginUserResponse | undefined> => {
  try {
    await client.connect();
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return {
        __typename: "FailedAuthentication",
        message: `Authentication failed`
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(user.password, password)
    if (!passwordMatch) {
      return {
        __typename: "FailedAuthentication",
        message: `Authentication failed`
      };
    }

    const token = jwt.sign({ userId: user._id }, Deno.env.get("JWT_SECRET_KEY"), {
      expiresIn: '1h',
    });

    return {
      __typename: "SuccessfulAuthentication",
      token
    }

  } catch (e) {
    return {
      __typename: "FailedAuthentication",
      message: `Authentication failed`
    };
  }
}

export const resolvers = {
  Query: {
    allUsers: () => allUsers(),
    oneUser: (_: any, args: any) => oneUser(args),
  },
  Mutation: {
    register: (_: any, args: RegisterUserBody) => register(args),
    login: (_: any, args: LoginUserBody) => login(args),
  },
};