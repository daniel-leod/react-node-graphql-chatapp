const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../config/.env") });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { UserInputError, AuthenticationError } = require("apollo-server");

const { User } = require("../../models");

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};

      try {
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password === "") errors.password = "Password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = "Wrong credentials";
          throw new UserInputError("Wrong credentials", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "Wrong credentials";
          throw new UserInputError("Wrong credentials", { errors });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
          expiresIn: process.env.EXPIRES_IN,
        });

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};

      try {
        // Validate input data
        if (email.trim() === "") errors.email = "Email must not be empty";
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm password must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords must match";

        // // Check if username / email exists
        // const userByUsername = await User.findOne({ where: { username } })
        // const userByEmail = await User.findOne({ where: { email } })

        // if (userByUsername) errors.username = 'Username is taken'
        // if (userByEmail) errors.email = 'Email is taken'

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // Hash password
        password = await bcrypt.hash(password, 6);

        // Create user
        const user = await User.create({
          username,
          email,
          password,
        });

        // Return user
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) =>
              (errors[e.path] = `${
                e.path.charAt(0).toUpperCase() + e.path.slice(1)
              } is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
