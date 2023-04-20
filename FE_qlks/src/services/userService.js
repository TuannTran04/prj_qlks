import React from "react";
import axios from "../utils/axios";

const handleLogin = (email, password) => {
  return axios.post("/api/v1/login-user", {
    email: email,
    password: password,
  });
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

const getUser = (customerId) => {
  return axios.get(`/api/v1/get-user?customerId=${customerId}`);
};

const getBookingsAccount = (currentPage, PAGE_SIZE, customerId) => {
  return axios.get(
    `/api/v1/get-bookings-account?page=${currentPage}&pageSize=${PAGE_SIZE}&customerId=${customerId}`
  );
};
const searchBookingsAccount = (searchQuery, customerId) => {
  return axios.get(
    `/api/v1/search-bookings-account?q=${searchQuery}&customerId=${customerId}`
  );
};

export {
  handleLogin,
  registerUser,
  getUser,
  forgetPassword,
  getBookingsAccount,
  searchBookingsAccount,
};
