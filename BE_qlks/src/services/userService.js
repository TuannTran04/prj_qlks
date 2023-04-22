import pool from "../configs/connectDB";
import bcrypt from "bcryptjs";
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0//", salt);

//>>>>>>>>>>>>>>>>>>> USER LOGIN <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);

      if (isExist) {
        // user already exist
        let [user] = await pool.execute(
          "select * from customers where email = ?",
          [email]
        );
        console.log(user);

        if (user) {
          if (user[0].disabled === 1) {
            userData.errCode = 4;
            userData.errMessage = "User account is currently disabled";
          } else {
            // compare password
            let check = await bcrypt.compareSync(password, user[0].password);
            if (check) {
              userData.errcode = 0;
              userData.errMessage = "ok";
              userData.user = user;
            } else {
              userData.errCode = 3;
              userData.errMessage = "Wrong password";
            }
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "user not found!!!";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "no exist!!!";
      }

      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let [user] = await pool.execute(
        "select * from customers where email = ?",
        [userEmail]
      );
      // console.log(">>> CHECK USER EMAIL <<<: ", user);

      if (user.length === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserName = (userName) => {
  return new Promise(async (res, rej) => {
    try {
      let [user] = await pool.execute(
        "select * from customers where name = ?",
        [userName]
      );
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

//>>>>>>>>>>>>>>>>>>> USER REGISTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<//
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { id, email, name, password, confirmPassword } = data;
      let userData = {};

      let hashPasswordFromBrcypt = await hashUserPassword(password);
      //   console.log(password);
      //   console.log(hashPasswordFromBrcypt);

      let isExistEmail = await checkUserEmail(email);
      let isExistName = await checkUserName(name);

      if (isExistEmail && isExistName) {
        userData.errCode = 1;
        userData.errMessage = "email va username nay da ton tai!!!";
      } else if (isExistName) {
        userData.errCode = 1;
        userData.errMessage = "username nay da ton tai!!!";
      } else if (isExistEmail) {
        userData.errCode = 1;
        userData.errMessage = "email nay da ton tai!!!";
      } else {
        await pool.execute(
          "insert into customers(email, name, password) values(?, ?, ?)",
          [email, name, hashPasswordFromBrcypt]
        );
        userData.errCode = 0;
        userData.errMessage = "ok create user success";
      }

      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let forgetPasswordUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email, password, confirmPassword } = data;
      let userData = {};

      let hashPasswordFromBrcypt = await hashUserPassword(password);
      //   console.log(password);
      //   console.log(hashPasswordFromBrcypt);

      let isExistEmail = await checkUserEmail(email);

      if (!isExistEmail) {
        userData.errCode = 1;
        userData.errMessage = "email nay khong ton tai!!!";
      } else {
        await pool.execute(
          "UPDATE customers SET password = ? WHERE email = ?",
          [hashPasswordFromBrcypt, email]
        );
        userData.errCode = 0;
        userData.errMessage = "ok change password user success";
      }

      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
let getBookings = (page, pageSize, customerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const limit = pageSize; // Số lượng phòng mỗi trang
      const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
      const [bookingList, fields] = await pool.execute(
        `SELECT * FROM bookings  WHERE customer_id = ? LIMIT ?, ?`,
        [customerId, offset, limit]
      );
      // Truy vấn số lượng phòng
      const [totalBooking, _] = await pool.execute(
        "SELECT COUNT(*) as total FROM bookings "
      );
      const total = totalBooking[0].total;
      resolve({ bookingList, total });
    } catch (err) {
      reject(err);
    }
  });
};

let handleChangeInfoUser = (customerId, dataUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, name, email } = dataUser;
      console.log(">>> CHECK DATA CUStomerS <<<:", dataUser);

      await pool.execute(
        "UPDATE customers SET name = ?, email = ? WHERE id = ?",
        [name, email, customerId]
      );

      resolve({ message: "update ok" });
    } catch (err) {
      reject(err);
    }
  });
};

let handleChangePasswordUser = (customerId, dataUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { oldPassword, newPassword, confirmNewPassword } = dataUser;
      console.log(">>> CHECK dataUser <<<: ", dataUser);

      let [user] = await pool.execute("select * from customers where id = ?", [
        customerId,
      ]);
      console.log(user);

      let checkOldPassword = await bcrypt.compareSync(
        oldPassword,
        user[0].password
      );
      console.log(">>> Check Old Password <<<", checkOldPassword);

      if (checkOldPassword) {
        let hashPasswordFromBrcypt = await hashUserPassword(newPassword);

        await pool.execute("UPDATE customers SET password = ? WHERE id = ?", [
          hashPasswordFromBrcypt,
          customerId,
        ]);
      } else {
        reject({ err: "Mật khẩu cũ không đúng." });
      }

      resolve({ message: "change password ok" });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  handleUserLogin,
  createNewUser,
  forgetPasswordUser,
  getBookings,
  handleChangeInfoUser,
  handleChangePasswordUser,
};
