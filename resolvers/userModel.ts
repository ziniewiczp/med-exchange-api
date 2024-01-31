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