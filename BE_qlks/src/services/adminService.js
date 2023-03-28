import pool from "../configs/connectDB";
import bcrypt from "bcryptjs";
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0//", salt);

let getRooms = (page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    try {
      const limit = pageSize; // Số lượng phòng mỗi trang
      const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
      // const [rows, fields] = await pool.execute("SELECT * FROM rooms");
      const [roomList, fields] = await pool.execute(
        `SELECT * FROM rooms LIMIT ?, ? `,
        [offset, limit]
      );
      // Truy vấn số lượng phòng
      const [totalRooms, _] = await pool.execute(
        "SELECT COUNT(*) as total FROM rooms "
      );
      const total = totalRooms[0].total;
      resolve({ roomList, total });
    } catch (err) {
      reject(err);
    }
  });
};

//>>>>>>>>>>>>>>>>>>> USER LOGIN <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
let handleAdminLogin = (adminname, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let adminData = {};
      let isExist = await checkAdminName(adminname);

      if (isExist) {
        // user already exist
        let [admin] = await pool.execute(
          "select * from admins where name = ?",
          [adminname]
        );
        console.log(admin);

        if (admin) {
          // compare password
          let check = await bcrypt.compareSync(password, admin[0].password);
          //   let check = password === admin[0].password;
          if (check) {
            adminData.errcode = 0;
            adminData.errMessage = "ok";
            adminData.admin = admin;
          } else {
            adminData.errCode = 3;
            adminData.errMessage = "Wrong password";
          }
        } else {
          adminData.errCode = 2;
          adminData.errMessage = "admin not found!!!";
        }
      } else {
        adminData.errCode = 1;
        adminData.errMessage = "no exist!!!";
      }

      resolve(adminData);
    } catch (e) {
      reject(e);
    }
  });
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //

let checkAdminName = (userName) => {
  return new Promise(async (res, rej) => {
    try {
      let [user] = await pool.execute("select * from admins where name = ?", [
        userName,
      ]);
      //   console.log(user);

      if (user.length === 1) {
        res(true);
      } else {
        res(false);
      }
    } catch (e) {
      rej(e);
    }
  });
};

//>>>>>>>>>>>>>>>>>>> ADMIN REGISTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
let createNewAdmin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { id, adminname, password, confirmPassword } = data;
      let adminData = {};

      let hashPasswordFromBrcypt = await hashAdminPassword(password);
      //   console.log(password);
      //   console.log(hashPasswordFromBrcypt);

      let isExistName = await checkAdminName(adminname);

      if (isExistName) {
        adminData.errCode = 1;
        adminData.errMessage = "adminname nay da ton tai!!!";
      } else {
        await pool.execute("insert into admins(name, password) values(?, ?)", [
          adminname,
          hashPasswordFromBrcypt,
        ]);
        adminData.errCode = 0;
        adminData.errMessage = "ok create admin success";
      }

      resolve(adminData);
    } catch (e) {
      reject(e);
    }
  });
};

let hashAdminPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleAdminLogin,
  createNewAdmin,
  getRooms,
};
