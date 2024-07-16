import DynOrm from "../../../db/DynOrm";

export default class UserRepository extends DynOrm {
  constructor() {
    const tableName = process.env.USER_TABLE || "users";
    super(tableName);
  }
}
