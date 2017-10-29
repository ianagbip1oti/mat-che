import { makeExecutableSchema } from "graphql-tools";

export const typeDefs = `

type User {
  name: String!
}

type Query {
  me: User
}

`;

export const schema = makeExecutableSchema({ typeDefs });
