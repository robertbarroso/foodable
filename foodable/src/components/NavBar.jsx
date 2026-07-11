import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <NavLink id="nav-bar-design" to="/ai-chat">
        AI Chat
      </NavLink>
      <NavLink id="nav-bar-design" to="/recipes">
        Recipes
      </NavLink>
      <NavLink id="nav-bar-design" to="/groceries">
        Groceries
      </NavLink>
      <NavLink id="nav-bar-design" to="/community">
        Community
      </NavLink>
    </nav>
  );
}

export default NavBar;
