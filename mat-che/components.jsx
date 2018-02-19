import React from "react";
import R from "ramda";

import { compose, gql, graphql, withApollo } from "react-apollo";
import {
  Button,
  Header,
  Icon,
  Input,
  List,
  Message,
  Modal
} from "semantic-ui-react";

import debug from "debug";

const log = debug("mat-che:components");

const meQuery = gql`
  query meQuery {
    me {
      name
    }
  }
`;

const messagesQuery = gql`
  query messagesQuery {
    messages {
      id
      user {
        name
        color
      }
      content
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

const sendMessageMutation = gql`
  mutation sendMessage($content: String!) {
    sendMessage(content: $content) {
      content
    }
  }
`;

const messageAdded = gql`
  subscription messageAdded {
    messageAdded {
      id
      user {
        name
        color
      }
      content
    }
  }
`;

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }

  addMessage(m) {
    this.setState({
      messages: R.take(37, R.prepend(m, this.state.messages))
    });
  }

  componentDidMount() {
    this.props.client
      .query({ query: messagesQuery })
      .then(rsp => this.setState({ messages: rsp.data.messages }));

    this.props.client.subscribe({ query: messageAdded }).subscribe({
      next: data => {
        this.addMessage(data.messageAdded);
      },
      error(err) {
        console.log(err);
      }
    });
  }

  render() {
    return (
      <List celled>
        {R.map(
          m => (
            <List.Item
              key={m.id}
              style={{
                borderLeftStyle: "solid",
                borderLeftWidth: 2,
                borderLeftColor: m.user.color
              }}
            >
              <List.Header style={{ color: m.user.color }}>
                {m.user.name}
              </List.Header>
              {m.content}
            </List.Item>
          ),
          this.state.messages
        )}
      </List>
    );
  }
}

export const ChatWithData = withApollo(Chat);

class SetName extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }

  isError() {
    return R.trim(this.state.name) === "";
  }

  onClick() {
    if (this.isError()) return;
    this.props
      .mutate({ variables: { name: this.state.name } })
      .then(this.props.onSet);
  }

  onChange(e) {
    this.setState({ name: e.target.value });
  }

  onKeyPress(e) {
    if (e.key === "Enter") {
      this.onClick();
    }
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
                  onClick={e => this.onClick()}
                />
              }
              fluid
              value={this.state.name}
              error={this.isError()}
              onChange={e => this.onChange(e)}
              onKeyPress={e => this.onKeyPress(e)}
            />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

const SetNameWithData = graphql(setNameMutation)(SetName);

export class SendMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: "" };
  }

  onClick() {
    if (R.trim(this.state.content) === "") return;
    this.props.mutate({ variables: { content: this.state.content } });
    this.setState({ content: "" });
  }

  onChange(e) {
    this.setState({ content: e.target.value });
  }

  onKeyPress(e) {
    if (e.key === "Enter") {
      this.onClick();
    }
  }

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
            {this.props.data.error.message}
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
        icon={
          <Icon
            name="send"
            bordered
            inverted
            link
            onClick={e => this.onClick()}
          />
        }
        fluid
        value={this.state.content}
        onChange={e => this.onChange(e)}
        onKeyPress={e => this.onKeyPress(e)}
      />
    );
  }
}

export const SendMessageWithData = compose(
  graphql(meQuery),
  graphql(sendMessageMutation)
)(SendMessage);
