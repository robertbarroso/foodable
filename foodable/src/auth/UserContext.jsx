import { createContext, useContext, useState, useEffect } from "react";

// To help pass down the user.id across the program.
const UserContext = createContext();

// 'children' is React lingo (apparently).
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const profile = localStorage.getItem("supabase_profile");

    if (!profile) {
      return null;
    }

    try {
      return JSON.parse(profile);
    } catch (error) {
      console.error("Error parsing saved profile:", error);
      return null;
    }
  });

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function selectUser() {
  return useContext(UserContext);
}
