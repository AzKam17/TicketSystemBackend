import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useJwt } from "react-jwt";
import { LogoutContext } from "../../providers/LogoutContext";

const RouteGuard = ({ component: Component, ...rest }) => {
  const { sessionExpiredHandler } = useContext(LogoutContext);
  const jwtToken = localStorage.getItem("jwt");
  const { isExpired } = useJwt(jwtToken);
  function hasJWT() {
    if (localStorage.getItem("jwt")) {
      return !isExpired;
    }
    sessionExpiredHandler();
    return false;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        hasJWT() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/connexion" }} />
        )
      }
    />
  );
};

export default RouteGuard;
