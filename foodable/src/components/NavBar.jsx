import { Link } from "react-router-dom";

function NavBar({}) {
  return (
    <>
      <nav>
        <Link id="nav-bar-design" to="/ai-chat">
          AI Chat
        </Link>
        <Link id="nav-bar-design" to="/recipes">
          Recipes
        </Link>
        <Link id="nav-bar-design" to="/groceries">
          Groceries
        </Link>
        <Link id="nav-bar-design" to="/community">
          Community
        </Link>
      </nav>
    </>
  );
}

export default NavBar;
