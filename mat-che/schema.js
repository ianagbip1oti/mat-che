import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

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

export const schema = makeExecutableSchema({ typeDefs, resolvers });
