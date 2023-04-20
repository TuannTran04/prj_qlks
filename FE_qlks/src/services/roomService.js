import React from "react";
import axios from "../utils/axios";

const getInfoHotelData = async () => {
  return axios.get(`/api/v1/get-info-hotel`);
};
const getRooms = (currentPage, PAGE_SIZE) => {
  return axios.get(
    `/api/v1/get-list-rooms?page=${currentPage}&pageSize=${PAGE_SIZE}`
  );
};
const getRoomsRelated = (roomId) => {
  return axios.get(`/api/v1/get-list-rooms-related?roomId=${roomId}`);
};
const createBookings = (dataBooking) => {
  return axios.post("/api/v1/create-booking", dataBooking);
};
const getListFAQs = () => {
  return axios.get(`/api/v1/get-list-FAQs`);
};
const getListCuisine = (currentPage, PAGE_SIZE) => {
  return axios.get(
    `/api/v1/get-list-cuisine?page=${currentPage}&pageSize=${PAGE_SIZE}`
  );
};
const getListService = (currentPage, PAGE_SIZE) => {
  return axios.get(
    `/api/v1/get-list-service?page=${currentPage}&pageSize=${PAGE_SIZE}`
  );
};

export {
  getInfoHotelData,
  getRooms,
  getRoomsRelated,
  createBookings,
  getListFAQs,
  getListCuisine,
  getListService,
};
