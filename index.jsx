import React from "react";
import { render } from "react-dom";

import { Container, Header, Menu, Segment } from "semantic-ui-react";

import { SendMessageWithData } from "./mat-che/components.jsx";

import { ApolloClient, ApolloProvider, createNetworkInterface } from "react-apollo";

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
});

const client = new ApolloClient({
  networkInterface,
});

const App = () => (
  <ApolloProvider client={client}>
    <Container text>
      <Header as="h1" block>Mat Che</Header>
      <SendMessageWithData />
    </Container>
  </ApolloProvider>
);

render(<App />, document.getElementById("app"));
