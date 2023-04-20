import pool from "../configs/connectDB";
import userService from "../services/userService.js";
// import bcrypt from "bcryptjs";
// var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("B4c0//", salt);

//>>>>>>>>>>>>>>>>>>> USER LOGIN <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
let handleLogin = async (req, res) => {
  let email = req.body.email;
  console.log(email);
  let password = req.body.password;
  console.log(password);

  if (!email || !password) {
    return res.status(200).json({
      errCode: 1,
      message: "error missing. please add parameters",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  console.log(userData);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user
      ? {
          id: userData.user[0].id,
          email: userData.user[0].email,
          name: userData.user[0].name,
        }
      : {},
  });
};

//>>>>>>>>>>>>>>>>>>> USER REGISTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
let createNewUser = async (req, res) => {
  let { id, email, name, password, confirmPassword } = req.body;
  console.log(">>> CHECK RES.BODY <<<: ", req.body);

  if (!email || !name || !password || !confirmPassword) {
    return res.status(200).json({
      errCode: 1,
      message: "missing required params",
    });
  }

  let userData = await userService.createNewUser(req.body);
  // console.log(message);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let forgetPasswordUser = async (req, res) => {
  let { email, password, confirmPassword } = req.body;
  console.log(">>> CHECK RES.BODY <<<: ", req.body);

  if (!email || !password || !confirmPassword) {
    return res.status(200).json({
      errCode: 1,
      message: "missing required params",
    });
  }

  let userData = await userService.forgetPasswordUser(req.body);
  console.log(userData);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
  });
};

let getUser = async (req, res) => {
  try {
    const customerId = req.query.customerId;
    const [customer, fields] = await pool.execute(
      "SELECT * FROM customers where id = ?",
      [customerId]
    );
    if (!customer || customer.length === 0) {
      return res.status(200).json({
        message: "not found customer",
        data: {},
      });
    }

    const { id, name, email } = customer[0];

    return res.status(200).json({
      message: "get customer ok",
      data: customer ? { id, name, email } : {},
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getBookingsAccount = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy trang hiện tại, mặc định là 1 nếu không có giá trị
    const pageSize = parseInt(req.query.pageSize) || 5;
    const customerId = parseInt(req.query.customerId);
    // console.log(">>> CHECK PAGE <<<: ", page);
    // console.log(">>> CHECK PAGESIZE <<<: ", pageSize);
    // console.log(">>> CHECK PAGESIZE <<<: ", customerId);
    const dataBooking = await userService.getBookings(
      page,
      pageSize,
      customerId
    );
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

let getSearchBookingsAccount = async (req, res) => {
  try {
    const customerId = parseInt(req.query.customerId);
    const [bookingList, fields] = await pool.execute(
      "SELECT * FROM bookings WHERE customer_id = ?",
      [customerId]
    );
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

module.exports = {
  handleLogin,
  createNewUser,
  forgetPasswordUser,
  getUser,
  getBookingsAccount,
  getSearchBookingsAccount,
};
