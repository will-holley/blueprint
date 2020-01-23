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
    table.string("name");
    //? password
    table
      .string("password")
      .notNullable()
      .unique()
      // remove from graphql
      .comment("@omit");
    //? password salt
    table
      .string("salt")
      .notNullable()
      .unique()
      // remove from graphql
      .comment("@omit");
    //? last login
    table.timestamp("last_login_at");
    //? completed tutorial?
    table.boolean("completed_tutorial");
  }

  static _addComments(table) {
    // Postgraphile will not automatically generate a creation mutation
    table.comment("@omit create");
  }
}

export default User;
