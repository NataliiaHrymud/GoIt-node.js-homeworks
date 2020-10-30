const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("./user.contacts");

module.exports = class UserListControllers {
  // Get user list
  static async getUserList(req, res, next) {
    const userList = await listContacts();
    return res.status(200).json(userList);
  }

  // Get user by id
  static getUserById(req, res, next) {
    return res.status(200).json(getContactById(req.params.id));
  }

  // Great new user
  static async createUser(req, res, next) {
    await addContact(req.body.name, req.body.email, req.body.phone);
    const newUser = await listContacts();
    return res.status(201).json(newUser[newUser.length - 1]);
  }

  // Update user
  static async updateUser(req, res, next) {
    await updateContact(req.params.id, req.body);
    return res.status(200).json(getContactById(req.params.id));
  }

  // deleteUser
  static async deleteUser(req, res, next) {
    await removeContact(req.params.id);
    return res.status(200).json({ message: "contact deleted" });
  }

  // Validate new user
  static validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const result = createUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Validate update user
  static validateUpdateUser(req, res, next) {
    const updateUserRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const result = updateUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Check User in list
  static async checkUserInList(req, res, next) {
    const userList = await listContacts();
    const targetUserIndex = userList.findIndex(
      (user) => user.id === req.params.id
    );
    if (targetUserIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }
    next();
  }
};
