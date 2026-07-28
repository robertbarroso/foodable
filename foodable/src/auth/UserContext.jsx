import { createContext, useContext, useState } from "react";

// To help pass down the user.id across the program.
const UserContext = createContext();

// 'children' is React lingo (apparently).
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

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
