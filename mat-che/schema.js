import { makeExecutableSchema } from "graphql-tools";

import { resolvers } from "./resolvers";

export const typeDefs = `

type User {
  name: String!
  color: String!
}

type Message {
  id: ID!
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

type Subscription {
  messageAdded: Message
}

`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });
