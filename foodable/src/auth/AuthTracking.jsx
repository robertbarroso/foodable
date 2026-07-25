import { useState } from "react";

export default function logIn(user_data) {
  const [loggedIn, setLoggedIn] = useState();
  const [currentUser, setCurrentUser] = useState();

  const handleLogIn = () => {
    setLoggedIn(true);
  };

  const handleCurrentUser = (user_data) => {
    setCurrentUser(user_data);
  };
}
