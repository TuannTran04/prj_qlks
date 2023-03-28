import pool from "../configs/connectDB";
import adminService from "../services/adminService.js";

let getRooms = async (req, res) => {
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

let getSearch = async (req, res) => {
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

let deleteRoom = async (req, res) => {
  try {
    let roomId = req.body.roomId;
    // console.log(">>> CHECK ROOM ID DELETE <<<: ", roomId);
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
    let { roomId, toggleActive } = req.body.data;
    console.log(">>> CHECK IDROOM ACTIVE <<<: ", roomId, toggleActive);
    await pool.execute("UPDATE rooms SET disabled = ? WHERE id = ?", [
      toggleActive,
      roomId,
    ]);
    res.status(200).json({
      errCode: 0,
      message: "active success",
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

//>>>>>>>>>>>>>>>>>>> USER REGISTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
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

module.exports = {
  handleAdminLogin,
  createNewAdmin,
  getRooms,
  getSearch,
  deleteRoom,
  activeRoomAdmin,
};
