const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const usersRouter = require("./users/user.routers");
const contactListRouter = require("./contacts/contact.routers");

require("dotenv").config();

module.exports = class StartServer {
  constructor() {
    this.server = null;
  }
  start() {
    this.initServer();
    this.initMiddlewares();
    this.initUserRoutes();
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

  initUserRoutes() {
    this.server.use("/api/user", usersRouter);
  }

  initRoutes() {
    this.server.use("/api/contacts", contactListRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port", process.env.PORT);
    });
  }
};