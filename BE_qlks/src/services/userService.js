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
        let [user] = await pool.execute("select * from users where email = ?", [
          email,
        ]);
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
      let [user] = await pool.execute("select * from users where email = ?", [
        userEmail,
      ]);
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
      let [user] = await pool.execute("select * from users where name = ?", [
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
          "insert into users(email, name, password) values(?, ?, ?)",
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
        await pool.execute("UPDATE users SET password = ? WHERE email = ?", [
          hashPasswordFromBrcypt,
          email,
        ]);
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

module.exports = {
  handleUserLogin,
  createNewUser,
  forgetPasswordUser,
};
