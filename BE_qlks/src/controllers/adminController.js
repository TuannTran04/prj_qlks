import pool from "../configs/connectDB";
import adminService from "../services/adminService.js";
const formidable = require("formidable");
import path from "path";
var appRoot = require("app-root-path");

let getInfoHotelAdmin = async (req, res) => {
  const hotelId = parseInt(req.query.hotelId) || null;

  let sql = `SELECT * FROM hotels`;
  const params = [];
  if (hotelId) {
    sql += ` WHERE id = ?`;
    params.push(hotelId);
  }

  const [hotel] = await pool.execute(sql, params);

  return res.status(200).json({
    message: "ok",
    data: hotel,
  });
};

let editInfoHotelAdmin = async (req, res) => {
  try {
    const hotelId = parseInt(req.query.hotelId);
    const { admin_id } = req.body;
    console.log(">>> CHECK hotelId <<<: ", hotelId);
    console.log(">>> CHECK RES.BODY <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    const dataRes = await adminService.handleEditInfoHotelAdmin(
      hotelId,
      req.body
    );
    // console.log(dataRes);

    return res.status(200).json({
      message: "update ok",
      // data: dataRoom[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADMIN ROOM
const roomsImgDir = appRoot + "/src/public/rooms_img";
let getRoomsAdmin = async (req, res) => {
  // rows la 1 arr chua cac phan tu obj row data trong table
  try {
    const page = parseInt(req.query.page) || 1; // Lấy trang hiện tại, mặc định là 1 nếu không có giá trị
    const pageSize = parseInt(req.query.pageSize) || 5;
    // console.log(">>> CHECK PAGE <<<: ", page);
    // console.log(">>> CHECK PAGESIZE <<<: ", pageSize);
    const dataRoom = await adminService.getRooms(page, pageSize);
    // console.log(dataRoom);
    return res.status(200).json({
      message: "ok",
      total: dataRoom.total,
      data: dataRoom.roomList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getSearchRoomsAdmin = async (req, res) => {
  try {
    const [roomList, fields] = await pool.execute("SELECT * FROM rooms");
    const query = req.query.q; // Lấy thông tin từ query parameter q
    const results = roomList.filter((room) =>
      room.name.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json({
      message: "search success",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let createNewRoom = async (req, res) => {
  try {
    let { name, admin_id } = req.body;
    console.log(">>> CHECK RES.BODY <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    // console.log(">>> CHECK RES.Files <<<: ", req.files);
    // const imagePath = req.file.path;
    // console.log(">>> CHECK RES.BODY imagePath <<<: ", imagePath);
    const fileName = req.file.filename;
    console.log(">>> CHECK RES.BODY fileName  <<<: ", fileName);

    const roomSlug = name.toLowerCase().replace(/\s+/g, "_");
    const imgPath = `/rooms_img/${roomSlug}_img/${fileName}`;

    const [hotel] = await pool.execute("SELECT id FROM hotels");
    // console.log(hotel);
    const hotelId = hotel[0].id;
    const dataRoom = await adminService.createRoom(
      admin_id,
      hotelId,
      imgPath,
      req.body
    );

    return res.status(200).json({
      message: "create success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getRoomEdit = async (req, res) => {
  try {
    const roomId = parseInt(req.query.roomId);
    const [dataRoom] = await pool.execute("SELECT * FROM rooms WHERE id = ?", [
      roomId,
    ]);
    // console.log(dataRoom);
    return res.status(200).json({
      message: "get ok",
      data: dataRoom[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let editRoomAdmin = async (req, res) => {
  try {
    const roomId = parseInt(req.query.roomId);
    const roomName = req.body.name;
    const admin_id = req.body.admin_id;
    // console.log(">>> CHECK ADMIN ID <<<", admin_id);
    let imgPath = "";

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    console.log(">>> CHECK RES.BODY <<<: ", req.body);
    if (req.file && req.file.filename) {
      const fileName = req.file.filename;
      console.log(">>> CHECK RES.BODY filename <<<: ", fileName);

      const roomSlug = roomName.toLowerCase().replace(/\s+/g, "_");
      imgPath = `/rooms_img/${roomSlug}_img/${fileName}`;
    }

    const dataRes = await adminService.handleEditRoom(
      admin_id,
      roomId,
      imgPath,
      req.body
    );
    console.log(dataRes);

    return res.status(200).json({
      // message: "get ok",
      message: dataRes ? dataRes.message : "get ok",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let deleteRoomAdmin = async (req, res) => {
  try {
    let roomId = req.body.roomId;
    let admin_id = req.body.admin_id;
    // console.log(">>> CHECK ROOM ID DELETE <<<: ", roomId);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    await pool.execute(`DELETE FROM bookings WHERE room_id = ?`, [roomId]);

    await pool.execute("delete from rooms where id = ?", [roomId]);

    res.status(200).json({
      errCode: 0,
      message: "delete success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

let activeRoomAdmin = async (req, res) => {
  try {
    let { roomId, toggleActive, admin_id } = req.body.data;
    console.log(">>> CHECK IDROOM ACTIVE <<<: ", roomId, toggleActive);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    await pool.execute(
      "UPDATE rooms SET admin_id = ?, disabled = ? WHERE id = ?",
      [admin_id, toggleActive, roomId]
    );
    res.status(200).json({
      errCode: 0,
      message: "active success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADMIN BOOKING
let getBookingsAdmin = async (req, res) => {
  // rows la 1 arr chua cac phan tu obj row data trong table
  try {
    const page = parseInt(req.query.page) || 1; // Lấy trang hiện tại, mặc định là 1 nếu không có giá trị
    const pageSize = parseInt(req.query.pageSize) || 5;
    // console.log(">>> CHECK PAGE <<<: ", page);
    // console.log(">>> CHECK PAGESIZE <<<: ", pageSize);
    const dataBooking = await adminService.getBookings(page, pageSize);
    // console.log(dataBooking);
    return res.status(200).json({
      message: "ok",
      total: dataBooking.total,
      data: dataBooking.bookingList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getSearchBookingsAdmin = async (req, res) => {
  try {
    const [bookingList, fields] = await pool.execute("SELECT * FROM bookings");
    console.log(bookingList);
    const query = req.query.q; // Lấy thông tin từ query parameter q
    const results = bookingList.filter((booking) =>
      booking.guest_name.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json({
      message: "search success",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getBookingEdit = async (req, res) => {
  try {
    const bookingId = parseInt(req.query.bookingId);

    const [roomList] = await pool.execute("SELECT * FROM rooms");
    const [dataBooking] = await pool.execute(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId]
    );
    // console.log(dataBooking);
    return res.status(200).json({
      message: "get ok",
      data: dataBooking[0],
      roomList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let editBookingAdmin = async (req, res) => {
  try {
    const bookingId = parseInt(req.query.bookingId);
    const { admin_id } = req.body;
    // console.log(">>> CHECK bookingId <<<: ", bookingId);
    // const roomName = req.body.name;
    // console.log(">>> CHECK RES.BODY <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    const dataRes = await adminService.handleEditBooking(bookingId, req.body);
    // console.log(dataRes);

    return res.status(200).json({
      message: dataRes ? dataRes.message : "get ok",
      // data: dataRoom[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let deleteBooking = async (req, res) => {
  try {
    let { bookingId, roomName, admin_id } = req.body;
    console.log(">>> CHECK ROOM ID DELETE <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    let dataBooking = await adminService.handleDeleteBooking(
      bookingId,
      roomName
    );

    res.status(200).json({
      errCode: 0,
      message: "delete success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADMIN CUSTOMER
let getCustomersAdmin = async (req, res) => {
  // rows la 1 arr chua cac phan tu obj row data trong table
  try {
    const page = parseInt(req.query.page); // Lấy trang hiện tại

    const pageSize = parseInt(req.query.pageSize);

    const customerId = parseInt(req.query.customerId);
    // console.log(">>> CHECK PAGE <<<: ", page);
    // console.log(">>> CHECK PAGESIZE <<<: ", pageSize);
    // console.log(">>> CHECK customerId <<<: ", customerId);
    const dataCustomer = await adminService.getCustomers(
      page,
      pageSize,
      customerId
    );
    // console.log(dataCustomer.customerList);
    // console.log(dataCustomer);
    return res.status(200).json({
      message: "ok",
      total: dataCustomer.total,
      data: dataCustomer.customerList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getSearchCustomersAdmin = async (req, res) => {
  try {
    const [customerList, fields] = await pool.execute(
      "SELECT id,name,email,disabled FROM customers"
    );
    console.log(customerList);
    const query = req.query.q; // Lấy thông tin từ query parameter q
    const results = customerList.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json({
      message: "search success",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let editCustomerAdmin = async (req, res) => {
  try {
    const customerId = parseInt(req.query.customerId);
    console.log(">>> CHECK customerId <<<: ", customerId);
    console.log(">>> CHECK RES.BODY <<<: ", req.body);

    const dataRes = await adminService.handleEditCustomer(customerId, req.body);
    console.log(dataRes);

    return res.status(200).json({
      message: "update ok",
      // data: dataRoom[0],
    });
  } catch (err) {
    console.error(">>> CHECK ERR EDIT CUSTOMER <<<", err);
    res.status(500).json({ error: err || "Internal server error" });
  }
};

let deleteCustomer = async (req, res) => {
  try {
    let customerId = req.body.customerId;
    let admin_id = req.body.admin_id;
    console.log(">>> CHECK customerId ID DELETE <<<: ", customerId);
    console.log(">>> CHECK admin_id ID DELETE <<<: ", admin_id);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    // Get the number of rooms that were booked by the user
    const [rows] = await pool.execute(
      "SELECT room_id, COUNT(*) AS num_bookings FROM bookings WHERE customer_id = ? GROUP BY room_id",
      [customerId]
    );

    console.log(rows);

    // Update the number of rooms in the rooms table
    let allUpdatesDone = false;
    if (rows.length > 0) {
      for (let row of rows) {
        await pool.execute(
          "UPDATE rooms SET number_of_available_rooms = number_of_available_rooms + ? WHERE id = ?",
          [row.num_bookings, row.room_id]
        );
        allUpdatesDone = true;
      }

      // Delete all bookings of the user
      await pool.execute("DELETE FROM bookings WHERE customer_id = ?", [
        customerId,
      ]);
    } else {
      allUpdatesDone = true;
    }

    // Delete the user
    if (allUpdatesDone) {
      await pool.execute("DELETE FROM customers WHERE id = ?", [customerId]);
    }

    res.status(200).json({
      errCode: 0,
      message: "delete success",
    });
  } catch (err) {
    console.error(">>> CHECK ERR DELETE CUSTOMER <<<", err);
    res.status(500).json({ error: err || "Internal server error" });
  }
};

let activeCustomerAdmin = async (req, res) => {
  try {
    let { admin_id, customerId, toggleActive } = req.body.data;
    console.log(">>> CHECK customerId ACTIVE <<<: ", customerId, toggleActive);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    await pool.execute(
      "UPDATE customers SET admin_id = ?, disabled = ? WHERE id = ?",
      [admin_id, toggleActive, customerId]
    );
    res.status(200).json({
      errCode: 0,
      message: "active success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADMIN FAQs
let getFAQsAdmin = async (req, res) => {
  // rows la 1 arr chua cac phan tu obj row data trong table
  try {
    const page = parseInt(req.query.page); // Lấy trang hiện tại
    const pageSize = parseInt(req.query.pageSize);
    const faqId = parseInt(req.query.faqId);
    // console.log(">>> CHECK PAGE <<<: ", page);
    // console.log(">>> CHECK PAGESIZE <<<: ", pageSize);
    // console.log(">>> CHECK userId <<<: ", faqId);
    const dataFAQ = await adminService.getFAQs(page, pageSize, faqId);
    // console.log(dataFAQ.userList);
    // console.log(dataFAQ.userList);
    // console.log(dataFAQ);
    return res.status(200).json({
      message: "ok",
      total: dataFAQ.total,
      data: dataFAQ.faqList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getSearchFAQsAdmin = async (req, res) => {
  try {
    const [faqList, fields] = await pool.execute("SELECT * FROM faqs");
    // console.log(faqList);
    const query = req.query.q; // Lấy thông tin từ query parameter q
    const results = faqList.filter((faq) =>
      faq.question.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json({
      message: "search success",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let createNewFAQ = async (req, res) => {
  try {
    let { question, answer, admin_id } = req.body;
    // console.log(">>> CHECK RES.BODY <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    const [hotel] = await pool.execute("SELECT id FROM hotels");
    // console.log(hotel);
    const hotelId = hotel[0].id;

    const sql = `INSERT INTO faqs (hotel_id, admin_id, question, answer) VALUES (?,?, ?, ?)`;
    await pool.execute(sql, [hotelId, admin_id, question, answer]);

    return res.status(200).json({
      message: "create success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let editFAQAdmin = async (req, res) => {
  try {
    const faqId = parseInt(req.query.faqId);
    console.log(">>> CHECK faqId <<<: ", faqId);
    const { admin_id } = req.body;
    console.log(">>> CHECK RES.BODY <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    const dataRes = await adminService.handleEditFAQ(faqId, req.body);
    console.log(dataRes);

    return res.status(200).json({
      message: "update ok",
      // data: dataRoom[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let deleteFAQ = async (req, res) => {
  try {
    let { faqId, admin_id } = req.body;
    console.log(">>> CHECK faqId ID DELETE <<<: ", req.body);
    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    await pool.execute("delete from faqs where id = ?", [faqId]);

    res.status(200).json({
      errCode: 0,
      message: "delete success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

let activeFAQAdmin = async (req, res) => {
  try {
    let { faqId, toggleActive, admin_id } = req.body.data;
    console.log(">>> CHECK customerId ACTIVE <<<: ", faqId, toggleActive);
    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }
    await pool.execute(
      "UPDATE faqs SET admin_id = ?, disabled = ? WHERE id = ?",
      [admin_id, toggleActive, faqId]
    );
    res.status(200).json({
      errCode: 0,
      message: "active success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADMIN MUSIC
let getListChannelAdmin = async (req, res) => {
  // rows la 1 arr chua cac phan tu obj row data trong table
  try {
    const [listChannelId] = await pool.execute("SELECT * FROM `channels`");
    return res.status(200).json({
      message: "ok",
      data: listChannelId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let createNewChannel = async (req, res) => {
  try {
    let { name, channel_id } = req.body;
    console.log(">>> CHECK RES.BODY <<<: ", req.body);

    const sql = `INSERT INTO channels (name, channel_id) VALUES (?, ?)`;
    await pool.execute(sql, [name, channel_id]);

    return res.status(200).json({
      message: "create success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADMIN CONTACT
let getContactAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page); // Lấy trang hiện tại
    const pageSize = parseInt(req.query.pageSize);
    const contactId = parseInt(req.query.contactId);
    console.log(">>> CHECK PAGE <<<: ", page);
    console.log(">>> CHECK PAGESIZE <<<: ", pageSize);
    console.log(">>> CHECK contactId <<<: ", contactId);
    const dataContact = await adminService.getContact(
      page,
      pageSize,
      contactId
    );
    // console.log(dataContact.userList);
    // console.log(dataContact.userList);
    // console.log(dataContact);
    return res.status(200).json({
      message: "ok",
      total: dataContact.total,
      data: dataContact.contactList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getSearchContactAdmin = async (req, res) => {
  try {
    const [contactList] = await pool.execute("SELECT * FROM contacts");
    console.log(contactList);
    const query = req.query.q; // Lấy thông tin từ query parameter q
    const results = contactList.filter((contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json({
      message: "search success",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let createNewContact = async (req, res) => {
  try {
    let { name, email, phone, message } = req.body;
    console.log(">>> CHECK RES.BODY <<<: ", req.body);

    const [hotel] = await pool.execute("SELECT id FROM hotels");
    // console.log(hotel);
    const hotelId = hotel[0].id;

    const sql = `INSERT INTO contacts (hotel_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)`;
    await pool.execute(sql, [hotelId, name, email, phone, message]);

    return res.status(200).json({
      message: "create success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let deleteContact = async (req, res) => {
  try {
    let { contactId, admin_id } = req.body;
    console.log(">>> CHECK contactId ID DELETE <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    await pool.execute("delete from contacts where id = ?", [contactId]);

    res.status(200).json({
      errCode: 0,
      message: "delete success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADMIN CUISINE
let getCuisinesAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const cuisineId = parseInt(req.query.cuisineId);
    const dataCuisine = await adminService.getCuisines(
      page,
      pageSize,
      cuisineId
    );
    // console.log(dataCuisine.cuisineList);
    // console.log(dataCuisine.cuisineList);
    // console.log(dataCuisine);
    return res.status(200).json({
      message: "ok",
      total: dataCuisine.total,
      data: dataCuisine.cuisineList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getSearchCuisinesAdmin = async (req, res) => {
  try {
    const [cuisineList] = await pool.execute("SELECT * FROM cuisines");
    console.log(cuisineList);
    const query = req.query.q; // Lấy thông tin từ query parameter q
    const results = cuisineList.filter((cuisine) =>
      cuisine.name.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json({
      message: "search success",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let createNewCuisine = async (req, res) => {
  try {
    const { admin_id } = req.body;
    console.log(req.body);
    const [hotel] = await pool.execute("SELECT id FROM hotels");
    // console.log(hotel);
    const hotelId = hotel[0].id;
    console.log(hotelId);
    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    let dataCuisine = await adminService.handleCreateCuisine(hotelId, req.body);

    return res.status(200).json({
      message: "create success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err || "Internal server error" });
  }
};

let activeCuisineAdmin = async (req, res) => {
  try {
    let { cuisineId, toggleActive, admin_id } = req.body.data;
    console.log(">>> CHECK cuisineId ACTIVE <<<: ", req.body.data);
    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }
    await pool.execute(
      "UPDATE cuisines SET admin_id = ?, disabled = ? WHERE id = ?",
      [admin_id, toggleActive, cuisineId]
    );
    res.status(200).json({
      errCode: 0,
      message: "active success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

let editCuisineAdmin = async (req, res) => {
  try {
    const cuisineId = parseInt(req.query.cuisineId);
    console.log(">>> CHECK cuisineId <<<: ", cuisineId);
    const { admin_id } = req.body;
    console.log(">>> CHECK RES.BODY <<<: ", req.body);
    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    const dataRes = await adminService.handleEditCuisine(cuisineId, req.body);
    console.log(dataRes);

    return res.status(200).json({
      message: "update ok",
      // data: dataRoom[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let deleteCuisine = async (req, res) => {
  try {
    let { cuisineId, admin_id } = req.body;
    console.log(">>> CHECK cuisineId ID DELETE <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    await pool.execute("delete from cuisines where id = ?", [cuisineId]);

    res.status(200).json({
      errCode: 0,
      message: "delete success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADMIN SERVICE
let getServicesAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const serviceId = parseInt(req.query.serviceId);
    const dataService = await adminService.getServices(
      page,
      pageSize,
      serviceId
    );
    // console.log(dataService.cuisineList);
    // console.log(dataService.cuisineList);
    // console.log(dataService);
    return res.status(200).json({
      message: "ok",
      total: dataService.total,
      data: dataService.serviceList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getSearchServicesAdmin = async (req, res) => {
  try {
    const [serviceList] = await pool.execute("SELECT * FROM services");
    console.log(serviceList);
    const query = req.query.q; // Lấy thông tin từ query parameter q
    const results = serviceList.filter((service) =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json({
      message: "search success",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let createNewService = async (req, res) => {
  try {
    const { admin_id } = req.body;
    console.log(req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    const [hotel] = await pool.execute("SELECT id FROM hotels");
    // console.log(hotel);
    const hotelId = hotel[0].id;
    console.log(hotelId);

    let dataService = await adminService.handleCreateService(hotelId, req.body);

    return res.status(200).json({
      message: "create success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err || "Internal server error" });
  }
};

let activeServiceAdmin = async (req, res) => {
  try {
    let { serviceId, toggleActive, admin_id } = req.body.data;
    console.log(">>> CHECK serviceId ACTIVE <<<: ", serviceId, toggleActive);
    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }
    await pool.execute(
      "UPDATE services SET admin_id = ?, disabled = ? WHERE id = ?",
      [admin_id, toggleActive, serviceId]
    );
    res.status(200).json({
      errCode: 0,
      message: "active success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

let editServiceAdmin = async (req, res) => {
  try {
    const serviceId = parseInt(req.query.serviceId);
    console.log(">>> CHECK serviceId <<<: ", serviceId);
    console.log(">>> CHECK RES.BODY <<<: ", req.body);

    const { admin_id } = req.body;
    console.log(">>> CHECK RES.BODY <<<: ", req.body);
    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    const dataRes = await adminService.handleEditService(serviceId, req.body);
    console.log(dataRes);

    return res.status(200).json({
      message: "update ok",
      // data: dataRoom[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

let deleteService = async (req, res) => {
  try {
    let { serviceId, admin_id } = req.body;
    console.log(">>> CHECK serviceId ID DELETE <<<: ", req.body);

    if (!(await checkAdminExist(admin_id))) {
      return res.status(400).json({ error: "admin does not exist" });
    }

    await pool.execute("delete from services where id = ?", [serviceId]);

    res.status(200).json({
      errCode: 0,
      message: "delete success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

//>>>>>>>>>>>>>>>>>>> ADMIN LOGIN <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
let handleAdminLogin = async (req, res) => {
  let adminname = req.body.adminname;
  console.log(adminname);
  let password = req.body.password;
  console.log(password);

  if (!adminname || !password) {
    return res.status(200).json({
      errCode: 1,
      message: "error missing. please add parameters",
    });
  }

  let adminData = await adminService.handleAdminLogin(adminname, password);
  console.log(adminData);

  return res.status(200).json({
    errCode: adminData.errCode,
    message: adminData.errMessage,
    admin: adminData.admin
      ? {
          id: adminData.admin[0].id,
          name: adminData.admin[0].name,
        }
      : {},
  });
};

//>>>>>>>>>>>>>>>>>>> ADMIN REGISTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
let createNewAdmin = async (req, res) => {
  let { id, adminname, password, confirmPassword } = req.body;
  console.log(">>> CHECK RES.BODY <<<: ", req.body);

  if (!adminname || !password || !confirmPassword) {
    return res.status(200).json({
      errCode: 1,
      message: "missing required params",
    });
  }

  let adminData = await adminService.createNewAdmin(req.body);
  // console.log(message);

  return res.status(200).json({
    errCode: adminData.errCode,
    message: adminData.errMessage,
    admin: adminData.admin ? adminData.admin : {},
  });
};

let forgetPasswordAdmin = async (req, res) => {
  let { name, password, confirmPassword } = req.body;
  console.log(">>> CHECK RES.BODY <<<: ", req.body);

  if (!name || !password || !confirmPassword) {
    return res.status(200).json({
      errCode: 1,
      message: "missing required params",
    });
  }

  let adminData = await adminService.forgetPasswordAdmin(req.body);
  console.log(adminData);

  return res.status(200).json({
    errCode: adminData.errCode,
    message: adminData.errMessage,
  });
};

// FUNCTION
let checkAdminExist = async (admin_id) => {
  const [admin] = await pool.execute(`SELECT * FROM admins WHERE id = ? `, [
    admin_id,
  ]);
  if (admin.length === 0) {
    return false;
  }
  return true;
};

module.exports = {
  getInfoHotelAdmin,
  editInfoHotelAdmin,
  handleAdminLogin,
  createNewAdmin,
  forgetPasswordAdmin,
  getRoomsAdmin,
  getSearchRoomsAdmin,
  createNewRoom,
  getRoomEdit,
  editRoomAdmin,
  deleteRoomAdmin,
  activeRoomAdmin,
  getBookingsAdmin,
  getSearchBookingsAdmin,
  getBookingEdit,
  editBookingAdmin,
  deleteBooking,
  getCustomersAdmin,
  getSearchCustomersAdmin,
  editCustomerAdmin,
  deleteCustomer,
  activeCustomerAdmin,
  createNewFAQ,
  getFAQsAdmin,
  getSearchFAQsAdmin,
  editFAQAdmin,
  deleteFAQ,
  activeFAQAdmin,
  getListChannelAdmin,
  createNewChannel,
  getContactAdmin,
  getSearchContactAdmin,
  createNewContact,
  deleteContact,
  getCuisinesAdmin,
  getSearchCuisinesAdmin,
  createNewCuisine,
  activeCuisineAdmin,
  editCuisineAdmin,
  deleteCuisine,
  getServicesAdmin,
  getSearchServicesAdmin,
  createNewService,
  activeServiceAdmin,
  editServiceAdmin,
  deleteService,
};
