import jwt from "jsonwebtoken";
// Models
import Model from "./_model";
// Utils
import db from "./../db";
import { genRandomString, sha512 } from "./../utils";

class User extends Model {
  static get table() {
    return "users";
  }

  static get _hasHumanId() {
    return false;
  }

  static _addFields(table) {
    //? email
    table
      .string("email")
      .unique()
      .notNullable()
      .index();
    //? name
    table.string("name").notNullable();
    //? password
    table
      .string("password")
      .notNullable()
      .unique();
    //? password salt
    table
      .string("salt")
      .notNullable()
      .unique();
    //? last login
    table.timestamp("last_login_at");
    //? completed tutorial?
    table.boolean("completed_tutorial");
  }

  /**
   * generate a salt of length 64
   */
  static hashPassword(password, salt) {
    return sha512(password, salt);
  }

  static genSalt() {
    return genRandomString(64);
  }

  static generateJWT(userId, email) {
    return jwt.sign({ _id: userId, email }, process.env.JWT_SIGNATURE, {
      expiresIn: "1d"
    });
  }

  /**
   * Errors are caught above.
   */
  static async create(name, email, passwordHash, salt) {
    const [user] = await db(this.table)
      .insert({
        name,
        email,
        password: passwordHash,
        salt
      })
      .returning(["id", "name", "email"]);
    return user;
  }

  /**
   * Look up the password salt given an email.
   * @param {string} email
   */
  static async fetchSalt(email) {
    const [user] = await db(this.table)
      .select("salt")
      .where("email", email)
      .returning(1);
    return user ? user.salt : null;
  }

  /**
   * Fetch a user given an email and hashed password, if both
   * exist and are matching credentials.
   * @param {string} email
   * @param {string} hashedPassword
   */
  static async fetchUser(email, hashedPassword) {
    const [user] = await db(this.table)
      .select(["id", "email", "name"])
      .where({
        email,
        password: hashedPassword
      })
      .returning(1);
    return user;
  }

  static async fetchById(id) {
    const [user] = await db(this.table)
      .select(["id", "email", "name"])
      .where("id", id)
      .returning(1);
    return user;
  }
}

export default User;
