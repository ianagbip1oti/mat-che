import React from "react";

import { gql, graphql } from "react-apollo";

import { Icon, Input, Message } from "semantic-ui-react";

const meQuery = gql`
  query meQuery {
    me {
      name
    }
  }
`;

export const SendMessage = ({ data: { loading, error, me } }) => {
  if (loading) {
    return (
      <Message info icon>
        <Icon name="circle notched" loading />
        <Message.Content>Loading...</Message.Content>
      </Message>
    );
  }
  if (error) {
    return (
      <Message icon negative>
        <Icon name="attention" />
        <Message.Content>
          <Message.Header>Error</Message.Header>
          {error.message}
        </Message.Content>
      </Message>
    );
  }
  return <Input label={me.name} icon={{ name: "send", link: true }} fluid />;
};

export const SendMessageWithData = graphql(meQuery)(SendMessage);
