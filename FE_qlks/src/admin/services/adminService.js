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

const forgetPasswordAdmin = (name, password, confirmPassword) => {
  return axios.post("/api/v1/forget-password-admin", {
    name: name,
    password: password,
    confirmPassword: confirmPassword,
  });
};

//********************* MANAGE HOTEL ***********************//
const getInfoHotelAdmin = (hotelId) => {
  return axios.get(`/api/v1/get-info-hotel-admin?hotelId=${hotelId}`);
};
const editInfoHotelAdmin = (formData, hotelId) => {
  return axios.put(
    `/api/v1/edit-info-hotel-admin?hotelId=${hotelId}`,
    formData
  );
};

//********************* MANAGE ROOM ***********************//
const getRoomsAdmin = (currentPage, PAGE_SIZE) => {
  return axios.get(
    `/api/v1/get-rooms-admin?page=${currentPage}&pageSize=${PAGE_SIZE}`
  );
};
const searchRoomsAdmin = (searchQuery) => {
  return axios.get(`/api/v1/search-rooms-admin?q=${searchQuery}`);
};
const addRoomAdmin = (formData) => {
  return axios.post("/api/v1/add-room-admin", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const getRoomEdit = (roomId) => {
  return axios.get(`/api/v1/get-room-edit?roomId=${roomId}`);
};
const editRoom = (formData, roomId) => {
  return axios.put(`/api/v1/edit-room-admin?roomId=${roomId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const deleteRoom = (roomId, admin_id) => {
  return axios.delete(`/api/v1/delete-room`, { data: { roomId, admin_id } });
};
const activeRoom = (roomId, toggleActive, admin_id) => {
  return axios.put(`/api/v1/active-room-admin`, {
    data: { roomId, toggleActive, admin_id },
  });
};

//********************* MANAGE BOOKING ***********************//
const getBookingsAdmin = (currentPage, PAGE_SIZE) => {
  return axios.get(
    `/api/v1/get-bookings-admin?page=${currentPage}&pageSize=${PAGE_SIZE}`
  );
};
const searchBookingsAdmin = (searchQuery) => {
  return axios.get(`/api/v1/search-bookings-admin?q=${searchQuery}`);
};
const getBookingEdit = (bookingId) => {
  return axios.get(`/api/v1/get-booking-edit?bookingId=${bookingId}`);
};
const editBooking = (formData, bookingId) => {
  return axios.put(
    `/api/v1/edit-booking-admin?bookingId=${bookingId}`,
    formData
  );
};
const deleteBooking = (bookingId, roomName, admin_id) => {
  return axios.delete(`/api/v1/delete-booking`, {
    data: { bookingId, roomName, admin_id },
  });
};

//********************* MANAGE CUSTOMER ***********************//
const getCustomersAdmin = (
  currentPage = null,
  PAGE_SIZE = null,
  customerId = null
) => {
  return axios.get(
    `/api/v1/get-customers-admin?page=${currentPage}&pageSize=${PAGE_SIZE}&customerId=${customerId}`
  );
};
const searchCustomersAdmin = (searchQuery) => {
  return axios.get(`/api/v1/search-customers-admin?q=${searchQuery}`);
};
const editCustomer = (formData, customerId) => {
  return axios.put(
    `/api/v1/edit-customer-admin?customerId=${customerId}`,
    formData
  );
};
const deleteCustomer = (customerId, admin_id) => {
  return axios.delete(`/api/v1/delete-customer`, {
    data: { customerId, admin_id },
  });
};
const activeCustomer = (customerId, toggleActive, admin_id) => {
  return axios.put(`/api/v1/active-customer-admin`, {
    data: { customerId, toggleActive, admin_id },
  });
};

//********************* MANAGE FAQs ***********************//
const getFAQsAdmin = (currentPage = null, PAGE_SIZE = null, faqId = null) => {
  return axios.get(
    `/api/v1/get-faqs-admin?page=${currentPage}&pageSize=${PAGE_SIZE}&faqId=${faqId}`
  );
};
const searchFAQsAdmin = (searchQuery) => {
  return axios.get(`/api/v1/search-faqs-admin?q=${searchQuery}`);
};
const addFAQAdmin = (formData) => {
  return axios.post("/api/v1/add-faq-admin", formData);
};
const editFAQ = (formData, faqId) => {
  return axios.put(`/api/v1/edit-faq-admin?faqId=${faqId}`, formData);
};
const deleteFAQ = (faqId, admin_id) => {
  return axios.delete(`/api/v1/delete-faq-admin`, {
    data: { faqId, admin_id },
  });
};
const activeFAQ = (faqId, toggleActive, admin_id) => {
  return axios.put(`/api/v1/active-faq-admin`, {
    data: { faqId, toggleActive, admin_id },
  });
};

//********************* MANAGE MUSIC ***********************//
const getListChannelId = () => {
  return axios.get(`/api/v1/get-channels-admin`);
};
const addChannelAdmin = (formData) => {
  return axios.post("/api/v1/add-channel-admin", formData);
};

//********************* MANAGE CONTACT ***********************//
const getContactAdmin = (
  currentPage = null,
  PAGE_SIZE = null,
  contactId = null
) => {
  return axios.get(
    `/api/v1/get-contact-admin?page=${currentPage}&pageSize=${PAGE_SIZE}&contactId=${contactId}`
  );
};
const searchContactAdmin = (searchQuery) => {
  return axios.get(`/api/v1/search-contact-admin?q=${searchQuery}`);
};
const deleteContact = (contactId, admin_id) => {
  return axios.delete(`/api/v1/delete-contact-admin`, {
    data: { contactId, admin_id },
  });
};
const createContact = (formData) => {
  return axios.post("/api/v1/add-contact-admin", formData);
};

//********************* MANAGE CUISINE ***********************//
const getCuisinesAdmin = (
  currentPage = null,
  PAGE_SIZE = null,
  cuisineId = null
) => {
  return axios.get(
    `/api/v1/get-cuisines-admin?page=${currentPage}&pageSize=${PAGE_SIZE}&cuisineId=${cuisineId}`
  );
};
const searchCuisinesAdmin = (searchQuery) => {
  return axios.get(`/api/v1/search-cuisines-admin?q=${searchQuery}`);
};
const createCuisine = (formData) => {
  return axios.post("/api/v1/add-cuisine-admin", formData);
};
const editCuisine = (formData, cuisineId) => {
  return axios.put(
    `/api/v1/edit-cuisine-admin?cuisineId=${cuisineId}`,
    formData
  );
};
const deleteCuisine = (cuisineId, admin_id) => {
  return axios.delete(`/api/v1/delete-cuisine-admin`, {
    data: { cuisineId, admin_id },
  });
};
const activeCuisine = (cuisineId, toggleActive, admin_id) => {
  return axios.put(`/api/v1/active-cuisine-admin`, {
    data: { cuisineId, toggleActive, admin_id },
  });
};

//********************* MANAGE SERVICE ***********************//
const getServicesAdmin = (
  currentPage = null,
  PAGE_SIZE = null,
  serviceId = null
) => {
  return axios.get(
    `/api/v1/get-services-admin?page=${currentPage}&pageSize=${PAGE_SIZE}&serviceId=${serviceId}`
  );
};
const searchServicesAdmin = (searchQuery) => {
  return axios.get(`/api/v1/search-services-admin?q=${searchQuery}`);
};
const createService = (formData) => {
  return axios.post("/api/v1/add-service-admin", formData);
};
const editService = (formData, serviceId) => {
  return axios.put(
    `/api/v1/edit-service-admin?serviceId=${serviceId}`,
    formData
  );
};
const deleteService = (serviceId, admin_id) => {
  return axios.delete(`/api/v1/delete-service-admin`, {
    data: { serviceId, admin_id },
  });
};
const activeService = (serviceId, toggleActive, admin_id) => {
  return axios.put(`/api/v1/active-service-admin`, {
    data: { serviceId, toggleActive, admin_id },
  });
};

export {
  handleAdminLogin,
  registerAdmin,
  forgetPasswordAdmin,
  getInfoHotelAdmin,
  editInfoHotelAdmin,
  getRoomsAdmin,
  searchRoomsAdmin,
  addRoomAdmin,
  getRoomEdit,
  editRoom,
  deleteRoom,
  activeRoom,
  getBookingsAdmin,
  searchBookingsAdmin,
  getBookingEdit,
  editBooking,
  deleteBooking,
  getCustomersAdmin,
  searchCustomersAdmin,
  editCustomer,
  deleteCustomer,
  activeCustomer,
  getFAQsAdmin,
  searchFAQsAdmin,
  addFAQAdmin,
  editFAQ,
  deleteFAQ,
  activeFAQ,
  getListChannelId,
  addChannelAdmin,
  getContactAdmin,
  searchContactAdmin,
  createContact,
  deleteContact,
  getCuisinesAdmin,
  searchCuisinesAdmin,
  createCuisine,
  editCuisine,
  activeCuisine,
  deleteCuisine,
  getServicesAdmin,
  searchServicesAdmin,
  createService,
  editService,
  activeService,
  deleteService,
};
