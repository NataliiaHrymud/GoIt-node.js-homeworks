const Joi = require("joi");
const bcrypt = require("bcrypt");
const userModel = require("./user.shema");
// const { hashPassword, findUser, updateToken } = require("./user.helpers");
var jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = class usersControllers {
  // Registration user
  static async registerUser(req, res, next) {
    try {
      const { email, password} = req.body;
      const userExsist = await userModel.findUserByEmail(email);
      if (!userExsist) {
        const saltRounds = 2;
        const newUser = await userModel.create({
          email,
          // password: await hashPassword(password),
          password: await bcrypt.hash(password, saltRounds),
        });
        return res.status(201).json({
          user: {
            email: newUser.email,
            subscription: newUser.subscription,
            id: newUser._id
          },
        });
      }
      return res.status(409).json({ message: "Email in use" });
    } catch (err) {
      next(err);
    } 
  }

  // login User
  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      // const user = await findUser(email);
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
      const token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECURE_KEY,
        { expiresIn: "2 days"} 
      );
      // updateToken(id, token);
      userModel.updateToken(user._id, token);
      return res.status(200).json({
        token: newToken,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // logout User
  static async logoutUser(req, res, next) {
    try {
      const user = req.user;
      updateToken(user._id, null);
      // updateToken(id, null);
      return res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  // Get current user
  static async getCurrentUser(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  // Update current user
  static async updateCurrentUser(req, res, next) {
    try {
      // const user = await userModel.findByIdAndUpdate(
      //   req.params.id,
      //   {
      //     $set: req.body,
      //   },
      //   { new: true }
      // );

      const user = await userModel.findUserByIdAndUpdate(
        req.params.id, 
        req.updateParams
        );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  // Validate user
  static validateUser(req, res, next) {
    const createContactRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = createContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Autorization user
  static async authorize(req, res, next) {
    try {
        // 1. витягнути токен користувача з заголовка Authorization
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      // 2. витягнути id користувача з пейлоада або вернути користувачу помилку 401
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECURE_KEY).id;
      } catch (err) {
        return res.status(401).json({ message: "Not authorized" });
      }
      // 3. витягнути відповідного користувача. Якщо такого немає - викинути помилку 401
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      // 4. Якщо все успішно - передаємо запис користувача і токен в req і передати обробку запиту на наступний middleware
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  }
};