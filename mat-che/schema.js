import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

export const typeDefs = `

type User {
  name: String!
}

type Message {
  user: User!
  content: String!
}

type Query {
  me: User
}

type Mutation {
  setName(name: String!): User
  sendMessage(content: String!): Message
}

`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });
