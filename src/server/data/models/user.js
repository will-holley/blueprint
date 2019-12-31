import Model from "./_model";

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
    //? last login
    table.timestamp("last_login_at");
    //? completed tutorial?
    table.boolean("completed_tutorial");
  }
}

export default User;
