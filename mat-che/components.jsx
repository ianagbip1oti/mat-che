import React from "react";

import { gql, graphql } from "react-apollo";

import { Button, Header, Icon, Input, Message, Modal } from "semantic-ui-react";

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

  if (!me) {
    return (
      <Modal open>
        <Modal.Header>Choose a Name</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Input icon={{ name: "send", link: true }} fluid />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  return <Input label={me.name} icon={{ name: "send", link: true }} fluid />;
};

export const SendMessageWithData = graphql(meQuery)(SendMessage);
