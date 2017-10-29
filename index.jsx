import React from "react";
import { render } from "react-dom";
import { Container, Header, Menu, Segment } from "semantic-ui-react";

import { SendMessage } from "./mat-che/components.jsx";

const App = () => (
  <div>
    <Header dividing>Mat Che</Header>
    <SendMessage />
  </div>
);

render(<App />, document.getElementById("app"));
