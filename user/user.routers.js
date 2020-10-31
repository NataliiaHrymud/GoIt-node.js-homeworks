const { Router } = require("express");
const userListRouter = Router();
const UserListControllers = require("./user.controller");

// Get User list
userListRouter.get("/", UserListControllers.getUserList);

// Сreate new User and add to list
userListRouter.post(
  "/",
  UserListControllers.validateCreateUser,
  UserListControllers.createUser
);

// Update information about User
userListRouter.patch(
  "/:id",
  UserListControllers.checkUserInList,
  UserListControllers.validateUpdateUser,
  UserListControllers.updateUser
);

// Find User by ID
userListRouter.get(
  "/:id",
  UserListControllers.checkUserInList,
  UserListControllers.getUserById
);

// Delete User by ID
userListRouter.delete(
  "/:id",
  UserListControllers.checkUserInList,
  UserListControllers.deleteUser
);

module.exports = userListRouter;