import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function UserAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const buttonText = currentUser ? currentUser.first_name : "Log in / Sign up";

  return (
    <NavLink id="nav-bar-user-auth" to="/user-auth">
      {buttonText}
    </NavLink>
  );
}
