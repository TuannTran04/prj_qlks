import React from "react";
import axios from "../utils/axios";

const handleLogin = (email, password) => {
  return axios.post("/api/v1/login-user", { email: email, password: password });
};

const registerUser = (email, password, name, confirmPassword) => {
  return axios.post("/api/v1/create-user", {
    email: email,
    password: password,
    name: name,
    confirmPassword: confirmPassword,
  });
};

const forgetPassword = (email, password, confirmPassword) => {
  return axios.post("/api/v1/forget-password-user", {
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  });
};

const getUser = (userId) => {
  return axios.get(`/api/v1/get-user?userId=${userId}`);
};

export { handleLogin, registerUser, getUser, forgetPassword };
