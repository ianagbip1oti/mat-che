import express from "express";
import path from "path";

const app = express();

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

app.get("/bundle.js", (req, res) =>
  res.sendFile(path.join(__dirname + "/build/bundle.js"))
);

app.listen(3000);
