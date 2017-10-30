import express from "express";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";

import { graphqlExpress, graphiqlExpress } from "graphql-server-express";

const app = express();

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
  graphiqlExpress({
    endpointURL: "/graphql"
  })
);

app.listen(3000);
