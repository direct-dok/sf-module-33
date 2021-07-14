import { appState } from "../app";
import { User } from "../models/User";
import { searchRoleUser } from "../utils";

export const authUser = function (login, password) {

  const role = searchRoleUser(login);

  const user = new User(login, password, role);
  if (!user.hasAccess) return false;
  console.log(user, 'Current User')
  appState.currentUser = user;
  return true;
};
