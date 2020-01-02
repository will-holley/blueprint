import express from "express";
// Utilities
import db from "../data/db";
import { loginValidation, registrationValidation, generateJWT } from "./utils";
// Models
import User from "../data/models/User";
// Middleware
import { requiresAuthentication } from "./middleware";

//! Create Router
const router = express();

//! Authentication Routes
/**
 * http://www.passportjs.org/docs/authenticate/
 */
router.post("/login", async function login({ body: { email, password } }, res) {
  //? Validation
  const { error, value: values } = loginValidation.validate({
    email,
    password
  });
  if (error) res.send({ error: error.details });

  try {
    //? Query the salt
    const salt = await User.fetchSalt(values.email);
    //? If there was no salt found, send a 403.  Don't send 404: allowing clients to
    //? differentiate between not found and bad pass allows them to determine which
    //? emails are registered in the system.
    if (!salt) {
      return res.send({
        error: "Incorrect email or password"
      });
    }
    //? Generate the password hash
    const hashedPassword = User.hashPassword(values.password, salt);
    //? Authenticate
    const user = await User.fetchUser(email, hashedPassword);
    if (user) {
      res.status = 200;
      return res.send({
        user,
        token: User.generateJWT(user.id, user.email)
      });
    } else {
      //? Bad password!
      return res.send({
        error: "Incorrect email or password"
      });
    }
  } catch (error) {
    res.send({
      error: error.message
    });
  }
});

router.post("/register", async function registerAccount(
  { body: { name, email, password }, login },
  res
) {
  //? Validation
  const { error, value: values } = registrationValidation.validate({
    name,
    email,
    password
  });
  if (error) res.send({ error: error.details });

  //? Salt and hash the password
  const salt = User.genSalt();
  const hashedPassword = User.hashPassword(values.password, salt);

  try {
    //? Create user record
    const user = await User.create(
      values.name,
      values.email,
      hashedPassword,
      salt
    );
    //? Return the user object with a jwt
    res.status(201);
    return res.send({
      user,
      token: User.generateJWT(user.id, user.email)
    });
  } catch (error) {
    //? Parse error messages
    let message = error.message;
    if (message.includes("violates unique constraint")) {
      message = "You already have an account. Instead, login.";
    }
    return res.send({ error: message });
  }
});

/**
 * User Profile
 */
router.get("/", requiresAuthentication, async ({ user }, res) => {
  try {
    const data = await User.fetchById(user._id);
    if (data) return res.send(data);
    return res.sendStatus(400);
  } catch (error) {
    res.sendStatus(400);
  }
});

export default router;
