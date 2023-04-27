import React from "react";
import { createContext } from "react";
import { decodeToken } from "react-jwt";

export const JWTDataContext = createContext();
export const JWTDataProvider = ({ children }) => {
  const getJWT = () => {
    return decodeToken(localStorage.getItem("jwt"));
  };

  return (
    <JWTDataContext.Provider value={{ getJWT }}>
      {children}
    </JWTDataContext.Provider>
  );
};
