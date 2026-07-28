import { selectUser } from "../auth/UserContext";
import { NavLink } from "react-router-dom";

export default function UserAuth() {
  const { currentUser } = selectUser();

  let buttonText = "Log in / Sign up";

  if (currentUser) {
    buttonText = `Hello, ${currentUser.first_name}`;
  }

  return (
    <NavLink id="nav-bar-user-auth" to="/user-auth">
      {buttonText}
    </NavLink>
  );
}
