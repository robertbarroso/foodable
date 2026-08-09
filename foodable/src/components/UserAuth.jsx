import { selectUser } from "../auth/UserContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function UserAuth() {
  const { currentUser, setCurrentUser } = selectUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("supabase_profile");
    localStorage.removeItem("supabase_access_token")

    navigate("/")
  }

  let buttonText = "Log in / Sign up";

  if (currentUser) {
    return (
      <div className="user-auth">
        <span>Hello, {currentUser.first_name}</span>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <NavLink id="nav-bar-user-auth" to="/user-auth">
      {buttonText}
    </NavLink>
  );
}
