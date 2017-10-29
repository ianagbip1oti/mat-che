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

const setNameMutation = gql`
  mutation setName($name: String!) {
    setName(name: $name) {
      name
    }
  }
`;

class SetName extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }

  isError() {
    return this.state.name === "";
  }

  onClick(e) {
    if (this.isError()) return;
    this.props
      .mutate({ variables: { name: this.state.name } })
      .then(this.props.onSet);
  }

  onChange(e) {
    this.setState({ name: e.target.value });
  }

  render() {
    return (
      <Modal open>
        <Modal.Header>Choose a Name</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Input
              icon={
                <Icon
                  name="send"
                  bordered
                  inverted
                  link
                  onClick={e => this.onClick(e)}
                />
              }
              fluid
              error={this.isError()}
              onChange={e => this.onChange(e)}
            />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

const SetNameWithData = graphql(setNameMutation)(SetName);

export class SendMessage extends React.Component {
  render() {
    if (this.props.data.loading) {
      return (
        <Message info icon>
          <Icon name="circle notched" loading />
          <Message.Content>Loading...</Message.Content>
        </Message>
      );
    }

    if (this.props.data.error) {
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

    if (!this.props.data.me) {
      return <SetNameWithData onSet={this.props.data.refetch.bind(this)} />;
    }

    return (
      <Input
        label={this.props.data.me.name}
        icon={{ name: "send", link: true }}
        fluid
      />
    );
  }
}

export const SendMessageWithData = graphql(meQuery)(SendMessage);
