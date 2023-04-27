import React, { createContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [jwt, setJwt] = React.useState(null);
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const localJwt = localStorage.getItem("jwt");
    if (localJwt) {
      setJwt(localJwt);
    } else {
      // if not on /connexion, redirect to /connexion
      if (window.location.pathname !== "/connexion") {
        window.location.pathname = "/connexion";
      }
    }
  }, []);

  useEffect(() => {
    if (jwt) {
      setUser(jwtDecode(jwt));
      setIsConnected(true);
      localStorage.setItem("jwt", jwt);
    }
  }, [jwt]);

  // If token expires, log out
  useEffect(() => {
    if (jwt && jwtDecode(jwt).exp * 1000 < Date.now()) {
      Logout();
    }
  });

  const Login = (
    username,
    password,
    beforeCallback,
    successCallback,
    errorCallback
  ) => {
    if (beforeCallback) beforeCallback();
    fetch("/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          if (errorCallback) errorCallback(data.message);
        } else {
          setJwt(data.token);
          if (successCallback) successCallback();
        }
      });
  };

  const Logout = (callBack, isSessionExpired) => {
    if (callBack) callBack();
    if (isSessionExpired) {
      localStorage.setItem("jwt-expired", true);
      setTimeout(() => {
        localStorage.removeItem("jwt-expired");
      }, 5000);
    }
    setJwt(null);
    setIsConnected(false);
    setUser(null);
    localStorage.removeItem("jwt");
  };

  return (
    <AuthContext.Provider value={{ jwt, user, isConnected, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
