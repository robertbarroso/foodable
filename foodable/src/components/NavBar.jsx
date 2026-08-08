import { NavLink, useNavigate } from "react-router-dom";
import UserAuth from "./UserAuth";
import { selectUser } from "../auth/UserContext";

function NavBar() {
  const { currentUser } = selectUser();

  return (
    <>
      <nav>
        <NavLink id="nav-bar-design" to="/">
          Home
        </NavLink>
        {currentUser && (
          <>
            <NavLink id="nav-bar-design" to="/ai-chat">
              AI Chat
            </NavLink>
            <NavLink id="nav-bar-design" to="/recipes">
              My Recipes
            </NavLink>
            <NavLink id="nav-bar-design" to="/groceries">
              My Groceries
            </NavLink>
          </>
        )}
        <NavLink id="nav-bar-design" to="/discovery">
          Discovery
        </NavLink>
        <NavLink id="nav-bar-design" to="/community">
          Community
        </NavLink>
        <UserAuth />
      </nav>
    </>
  );
}

export default NavBar;
