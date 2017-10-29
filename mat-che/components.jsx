import React from "react";

import { Input } from "semantic-ui-react";

export class SendMessage extends React.Component {
  render() {
    return <Input label="Name" icon={{ name: "send", link: true }} fluid />;
  }
}
