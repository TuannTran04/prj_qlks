import express from "express";
import APIController from "../controllers/APIController.js";
import userController from "../controllers/userController.js";
import adminController from "../controllers/adminController.js";
import homeController from "../controllers/homeController.js";
const multer = require("multer");
import path from "path";
var appRoot = require("app-root-path");
const fs = require("fs-extra");
const { promisify } = require("util");

let router = express.Router();

const roomsImgDir = appRoot + "/src/public/rooms_img";
// console.log(">>> CHECK ROOMS IMG DIR <<<: ", roomsImgDir);

const storage = multer.diskStorage({
  // noi save file img
  destination: async function (req, file, cb) {
    // console.log(">>> CHECK APPROOT <<<: ", appRoot);
    // console.log(">>> CHECK FILE <<<: ", req.body);
    // const roomId = req.body.roomId;
    console.log(">>> CHECK FILE <<<: ", req.headers);
    const roomName = req.headers.roomname;
    console.log(">>> CHECK ROOM ID <<<: ", roomName);

    const roomSlug = roomName.toLowerCase().replace(/\s+/g, "_");
    console.log(roomSlug);

    const roomDir = path.join(roomsImgDir, `${roomSlug}_img`);
    try {
      await fs.ensureDir(roomDir);
      cb(null, roomDir);
    } catch (err) {
      cb(err);
    }
    cb(null, roomDir);
    // cb(null, appRoot + "/src/public/rooms_img/");
  },

  // dat ten file doc nhat', kh bi trung`
  filename: function (req, file, cb) {
    // console.log(">>> CHECK REQ BODY FILENAME <<<:", req.body);
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// kh match duoi file thi bao loi
const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

let upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

const initAPIRoute = (app) => {
  // METHOD GET => Read data
  router.get("/users", APIController.getAllUsers);

  // METHOD POST => Create data

  // METHOD PUT => Update data
  // router.put("/update-user", APIController.updateUser);

  // METHOD DELETE => Delete data
  // router.delete("/delete-user/:id", APIController.deleteUser);

  // USER
  router.post("/login", userController.handleLogin);
  router.post("/create-user", userController.createNewUser);
  router.get("/rooms", APIController.getRooms);
  router.get("/search", APIController.getSearch);
  router.post("/booking", APIController.createBooking);

  // ADMIN
  router.post("/login-admin", adminController.handleAdminLogin);
  router.post("/create-admin", adminController.createNewAdmin);
  router.delete("/delete-room", adminController.deleteRoom);
  router.get("/rooms-admin", adminController.getRooms);
  router.get("/search-admin", adminController.getSearch);
  router.put("/active-room-admin", adminController.activeRoomAdmin);

  router.post("/upload-image", upload.single("image"), (req, res) => {
    // Trả về đường dẫn của ảnh đã upload để hiển thị lên giao diện
    // console.log(">>> CHECK CONTROLLER UPLOAD <<<: ", req.file);
    console.log(">>> CHECK CONTROLLER UPLOAD <<<: ", req.headers.roomname);
    const roomName = req.headers.roomname;

    // Deluxe Sky => deluxe_sky
    const roomSlug = roomName.toLowerCase().replace(/\s+/g, "_");

    res.json({
      imagePath: `/rooms_img/${roomSlug}_img/${req.file.filename}`,
      message: "ok",
    });
  });

  return app.use("/api/v1", router);
};

// export
export default initAPIRoute;
