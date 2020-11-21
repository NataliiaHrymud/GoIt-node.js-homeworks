const { Router } = require("express");
const usersRouter = Router();
const usersControllers = require("./user.controllers");
const {upload} = require("./user.helpers");

// Registration request
usersRouter.post(
  "/auth/register",
  usersControllers.validateUser,
  usersControllers.registerUser
);

// Login request
usersRouter.post(
  "/auth/login",
  usersControllers.validateUser,
  usersControllers.loginUser
);

// Logout request
usersRouter.post(
  "/auth/logout",
  usersControllers.authorize,
  usersControllers.logoutUser
);

// Current user request
usersRouter.get(
  "/users/current",
  usersControllers.authorize,
  usersControllers.getCurrentUser
);

// Update information in user
usersRouter.patch(
  "/users/:id",
  usersControllers.authorize,
  usersControllers.updateCurrentUser
);

// Create user avatar
usersRouter.patch(
  "/users/avatars",
  usersControllers.authorize,
  upload.single("avatars"),
  usersControllers.addAvatar
  );

module.exports = usersRouter;