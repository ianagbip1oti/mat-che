import express from "express";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";

import { graphqlExpress, graphiqlExpress } from "graphql-server-express";

import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";

const app = express();

const PORT = 3000;

import { schema } from "./mat-che/schema.js";

app.use(
  session({
    secret: "not-so-secret",
    resave: false,
    saveUninitialized: true
  })
);

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

app.get("/bundle.js", (req, res) =>
  res.sendFile(path.join(__dirname + "/build/bundle.js"))
);

app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(req => ({
    schema: schema,
    context: { sid: req.session.id }
  }))
);

app.use(
  "/graphiql",
  graphiqlExpress(req => ({
    endpointURL: "/graphql",
    subscriptionsEndpoint: `ws://${req.headers.host}/subscriptions`
  }))
);

const ws = createServer(app);

ws.listen(PORT, () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );
});
