import React from "react";
import { render } from "react-dom";

import { Container, Header, Menu, Segment } from "semantic-ui-react";

import { SendMessageWithData } from "./mat-che/components.jsx";

import { ApolloClient, ApolloProvider } from "react-apollo";

const client = new ApolloClient();

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Header dividing>Mat Che</Header>
      <SendMessageWithData />
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById("app"));
