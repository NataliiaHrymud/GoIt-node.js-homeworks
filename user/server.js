const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userListRouter = require("./user.routers");

require("dotenv").config();

module.exports = class UserList {
  constructor() {
    this.server = null;
  }
  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: "http://localhost:4000" }));
  }

  initRoutes() {
    this.server.use("/api/contacts", userListRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port", process.env.PORT);
    });
  }
};