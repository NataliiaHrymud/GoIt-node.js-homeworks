const { Router } = require("express");
const contactListRouter = Router();
const ContactListControllers = require("./contact.controller");

// Get User list
contactListRouter.get("/", ContactListControllers.getContactList);

// Сreate new User and add to list
contactListRouter.post(
  "/",
  ContactListControllers.validateCreateContact,
  ContactListControllers.createContact
);

// Update information about User
contactListRouter.patch(
  "/:id",
  ContactListControllers.checkContactInList,
  ContactListControllers.validateUpdateContact,
  ContactListControllers.updateContact
);

// Find User by ID
contactListRouter.get(
  "/:id",
  ContactListControllers.checkContactInList,
  ContactListControllers.getContactById
);

// Delete User by ID
contactListRouter.delete(
  "/:id",
  ContactListControllers.checkContactInList,
  ContactListControllers.deleteContact
);

module.exports = contactListRouter;