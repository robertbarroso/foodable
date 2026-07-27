import { NavLink } from "react-router-dom";

export default function userAuth() {
  return (
    <NavLink id="nav-bar-user-auth" to="/user-auth">
      Log in / Sign up{" "}
    </NavLink>
  );
}
