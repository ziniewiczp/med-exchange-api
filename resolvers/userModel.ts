export interface User {
  id: string,
  email: string,
  updatedAt: string,
  createdAt: string,
  password: string,
}

export interface RegisterUserBody {
  email: string,
  password: string
}

export type RegisterUserResponse = {
  __typename: string,
  id: string
} | {
  __typename: string,
  message: string
}

export interface GetUserBody {
  id: string
}

export type GetUserResponse = Omit<User, "password">;

export type GetUsersResponse = Omit<User, "password">[];