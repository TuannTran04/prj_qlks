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
    const userId = req.query.userId;
    const [user, fields] = await pool.execute(
      "SELECT * FROM users where id = ?",
      [userId]
    );
    if (!user || user.length === 0) {
      return res.status(200).json({
        message: "not found user",
        data: {},
      });
    }

    const { id, name, email } = user[0];

    return res.status(200).json({
      message: "get user ok",
      data: user ? { id, name, email } : {},
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleLogin,
  createNewUser,
  forgetPasswordUser,
  getUser,
};
