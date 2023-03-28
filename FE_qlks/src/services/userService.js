import React from "react";
import axios from "../utils/axios";

const handleLogin = (email, password) => {
  return axios.post("/api/v1/login", { email: email, password: password });
};

const registerUser = (email, password, name, confirmPassword) => {
  return axios.post("/api/v1/create-user", {
    email: email,
    password: password,
    name: name,
    confirmPassword: confirmPassword,
  });
};

export { handleLogin, registerUser };
