import React from "react";
import axios from "../utils/axios";

const getRooms = (currentPage, PAGE_SIZE) => {
  return axios.get(`/api/v1/rooms?page=${currentPage}&pageSize=${PAGE_SIZE}`);
};
const createBookings = (dataBooking) => {
  return axios.post("/api/v1/booking", dataBooking);
};

export { getRooms, createBookings };
