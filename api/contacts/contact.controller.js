const Joi = require("joi");
const contactModel = require('./contact.schema');
const { Types: { ObjectId } } = require("mongoose");

module.exports = class ContactListControllers {
  // Get user list
  static async getContactList(req, res, next) {
    try {
      const contacts = await contactModel.find();
      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }    
  }

  // Get user by id
  static async getContactById(req, res, next) {
    try {
      const contact = await contactModel.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found"});
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    } 
  }

  // Create new user
  static async createContact(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }    
  }

  // Update user
  static async updateContact(req, res, next) {
    try {
      const contact = await contactModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true}
        );
        if (!contact) {
          return res.status(404).json({ message: "Contact not found"});
        }
      return res.status(200).json(contact);
    } catch(err) {
      next(err);
    } 
  }

  // delete User
  static async deleteContact(req, res, next) {
    try {
      const contact = await contactModel.findByIdAndDelete(req.params.id);
        if (!contact) {
          return res.status(404).json({ message: "Contact not found"});
        }
      return res.status(200).json({ message: "Contact deleted"});
    } catch(err) {
      next(err);
    }
  }

  // Validate new user
  static validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string(),
    });
    const result = createContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Validate update user
  static validateUpdateContact(req, res, next) {
    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });
    const result = updateContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Check User in list
  static async checkContactInList(req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Not found" });
    }
    next();
  }
};
