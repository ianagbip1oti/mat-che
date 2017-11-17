import express from "express";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import memoryStore from "memorystore";

import {
  graphqlExpress,
  graphiqlExpress
} from "graphql-server-express";

import {
  execute,
  subscribe
} from "graphql";
import {
  createServer
} from "http";
import {
  SubscriptionServer
} from "subscriptions-transport-ws";

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

import {
  schema
} from "./mat-che/schema.js";

const MemoryStore = memoryStore(session)

app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 300 //check for expired entries every 5 minutes
    }),
    secret: "not-so-secret",
    resave: false,
    saveUninitialized: true
  })
);

app.get("/", (req, res) =>
  res.render("index", {
    google_tracking_id: process.env.GOOGLE_TRACKING_ID
  })
);

app.get("/bundle.js", (req, res) =>
  res.sendFile(path.join(__dirname + "/build/bundle.js"))
);

app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(req => ({
    schema: schema,
    context: {
      sid: req.session.id
    }
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
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: "/subscriptions"
  });
});
