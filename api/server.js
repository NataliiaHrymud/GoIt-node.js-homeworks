const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const userListRouter = require("./contacts/contact.routers");


require("dotenv").config();

module.exports = class UserList {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDataBase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: `http://localhost:${process.env.PORT}` }));
  }

  initRoutes() {
    this.server.use("/api/contacts", userListRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port", process.env.PORT);
    });
  }

  async initDataBase() {
    try{
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })       
      console.log("Database connection successful");
    }catch (err){
      console.log(err);
      process.exit(1);
    }
  }
  // async initDataBase() {
  //   await mongoose
  //     .connect(process.env.MONGODB_URL, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useFindAndModify: false,
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       process.exit(1);
  //     });
  //   console.log("Database connection successful");
  // }
};