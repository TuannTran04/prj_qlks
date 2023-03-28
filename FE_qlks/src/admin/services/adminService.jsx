import React from "react";
import axios from "../../utils/axios";

const handleAdminLogin = (name, password) => {
  return axios.post("/api/v1/login-admin", {
    adminname: name,
    password: password,
  });
};

const registerAdmin = (name, password, confirmPassword) => {
  return axios.post("/api/v1/create-admin", {
    adminname: name,
    password: password,
    confirmPassword: confirmPassword,
  });
};

const getRooms = (currentPage, PAGE_SIZE) => {
  return axios.get(
    `/api/v1/rooms-admin?page=${currentPage}&pageSize=${PAGE_SIZE}`
  );
};

const searchRooms = (searchQuery) => {
  return axios.get(`/api/v1/search-admin?q=${searchQuery}`);
};
const deleteRoom = (roomId) => {
  return axios.delete(`/api/v1/delete-room`, { data: { roomId } });
};
const activeRoom = (roomId, toggleActive) => {
  return axios.put(`/api/v1/active-room-admin`, {
    data: { roomId, toggleActive },
  });
};

export {
  handleAdminLogin,
  registerAdmin,
  getRooms,
  searchRooms,
  deleteRoom,
  activeRoom,
};
