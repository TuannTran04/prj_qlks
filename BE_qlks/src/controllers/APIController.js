import pool from "../configs/connectDB";
import CRUDService from "../services/CRUDService";
// import bcrypt from "bcryptjs";
// var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("B4c0//", salt);

let getAllUsers = async (req, res) => {
  const [rows, fields] = await pool.execute("SELECT * FROM `users`");

  return res.status(200).json({
    message: "ok",
    data: rows,
  });
};

let getRooms = async (req, res) => {
  // rows la 1 arr chua cac phan tu obj row data trong table
  try {
    const page = parseInt(req.query.page) || 1; // Lấy trang hiện tại, mặc định là 1 nếu không có giá trị
    const pageSize = parseInt(req.query.pageSize) || 5;
    // console.log(">>> CHECK PAGE <<<: ", page);
    // console.log(">>> CHECK PAGESIZE <<<: ", pageSize);
    const dataRoom = await CRUDService.getRooms(page, pageSize);
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

let getSearch = async (req, res) => {
  try {
    const [roomList, fields] = await pool.execute(
      "SELECT * FROM rooms WHERE disabled = 0"
    );
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

let createBooking = async (req, res) => {
  // rows la 1 arr chua cac phan tu obj row data trong table
  try {
    console.log(req.body);

    let dataBooking = await CRUDService.handleDataBooking(req.body);

    res.json({
      errCode: 0,
      success: true,
      message: "Thông tin booking của bạn đã được lưu trữ thành công!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getRooms,
  getSearch,
  createBooking,

  // createNewUser,
  // updateUser,
  // deleteUser,
};
