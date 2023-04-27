import React from "react";

const create = (data, files) => {
  let formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  if (files) {
    Object.keys(files).forEach((key) => {
      formData.append(key, files[key]);
    });
  }

  const token = localStorage.getItem("jwt");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return fetch("/api/contrat/new", {
    method: "POST",
    headers: headers,
    body: formData,
  });
};

const findUserContrats = async () => {
  const jwtToken = localStorage.getItem("jwt");
  const headers = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
  const response = await fetch("/api/contrat", { headers });
  return await response.json();
};

const findContrat = async (id) => {
  const jwtToken = localStorage.getItem("jwt");
  const headers = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
  const response = await fetch(`/api/contrat/infos/${id}`, { headers });
  return await response.json();
};

export { create, findUserContrats, findContrat };
