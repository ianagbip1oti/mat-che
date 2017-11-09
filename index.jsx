import React from "react";
import { render } from "react-dom";

import {
  Container,
  Header,
  Menu,
  Message,
  Segment,
  Sticky
} from "semantic-ui-react";

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
      <Message>
        <h1 style={{ display: "inline" }}>Mat.Che. </h1>
        <span style={{ whiteSpace: "nowrap" }}>
          Anonymous Chat. No History.
        </span>
      </Message>
      <SendMessageWithData />
      <ChatWithData />
    </Container>
  </ApolloProvider>
);

render(<App />, document.getElementById("app"));
