import { makeExecutableSchema } from "graphql-tools";

export const typeDefs = `

type User {
  name: String!
}

type Query {
  me: User
}

type Mutation {
  setName(name: String!): User
}

`;

export const schema = makeExecutableSchema({ typeDefs });
