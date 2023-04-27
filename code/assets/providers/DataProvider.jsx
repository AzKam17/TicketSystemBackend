import React, { useContext } from "react";
import { createContext } from "react";
import { LogoutContext } from "./LogoutContext";
import axios from "axios";

const API_PREFIX = "/api";

export const DataProviderContext = createContext();

export const DataProvider = ({ children }) => {
  const [dataStore, setDataStore] = React.useState({});
  const { sessionExpiredHandler } = useContext(LogoutContext);

  // wait for fetch data from API, then give data to the callback
  const getData = async (dataUrl, callback) => {
    // add jwt token to the request if it exists
    const jwtToken = localStorage.getItem("jwt");
    const headers = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
    const response = await fetch(`${API_PREFIX}${dataUrl}`, { headers });
    const data = await response.json();
    if (data.code === 401) {
      sessionExpiredHandler();
    }
    callback(data);
  };

  const postData = async (data, url) => {
    const token = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(url, data, { headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          sessionExpiredHandler();
        } else {
          // gérez tout autre type d'erreur ici
        }
      });
  };

  return (
    <DataProviderContext.Provider value={{ getData }}>
      {children}
    </DataProviderContext.Provider>
  );
};
