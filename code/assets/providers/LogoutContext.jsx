import React from "react";
import { createContext } from "react";

export const LogoutContext = createContext();

export const LogoutProvider = ({ children }) => {
  const [logoutVal, setLogoutVal] = React.useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/connexion";
  };

  const sessionExpiredHandler = () => {
    localStorage.setItem("jwt-expired", true);
    setTimeout(() => {
      localStorage.removeItem("jwt-expired");
    }, 5000);
    logoutHandler();
  };

  return (
    <LogoutContext.Provider
      value={{ logoutVal, logoutHandler, sessionExpiredHandler }}
    >
      {children}
    </LogoutContext.Provider>
  );
};
