import React from "react";
import { render } from "react-dom";

import { Container, Header, Menu, Segment, Sticky } from "semantic-ui-react";

import { ChatWithData, SendMessageWithData } from "./mat-che/components.jsx";

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";

import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from "subscriptions-transport-ws";

const networkInterface = createNetworkInterface({
  uri: "/graphql",
  opts: {
    credentials: "same-origin"
  }
});

const wsClient = new SubscriptionClient(
  `${"https:" === location.protocol
    ? "wss"
    : "ws"}://${location.host}/subscriptions`,
  {
    reconnect: true
  }
);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

const App = () => (
  <ApolloProvider client={client}>
    <Container text>
      <Header as="h1" block>
        Mat Che
      </Header>
      <SendMessageWithData />
      <ChatWithData />
    </Container>
  </ApolloProvider>
);

render(<App />, document.getElementById("app"));
