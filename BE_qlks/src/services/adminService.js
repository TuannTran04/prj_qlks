import pool from "../configs/connectDB";
import bcrypt from "bcryptjs";
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0//", salt);

let handleEditInfoHotelAdmin = (hotelId, dataHotel) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        email,
        address,
        phone,
        description,
        slider_home,
        slider_ins,
        src_ggmap,
        admin_id,
      } = dataHotel;
      console.log(">>> CHECK DATA HOTEL <<<:", dataHotel);

      await pool.execute(
        "UPDATE hotels SET admin_id = ?, name = ?, email = ?, address = ?, phone = ?, description = ?, slider_home = ?, slider_ins = ?, src_ggmap = ?  WHERE id = ?",
        [
          admin_id,
          name,
          email,
          address,
          phone,
          description,
          JSON.stringify(slider_home),
          JSON.stringify(slider_ins),
          src_ggmap,
          hotelId,
        ]
      );

      resolve({ message: "update ok" });
    } catch (err) {
      reject(err);
    }
  });
};

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

let createRoom = (admin_id, hotelId, imgPath, dataRoom) => {
  return new Promise(async (resolve, reject) => {
    let {
      name,
      description,
      price,
      quantity,
      area,
      view_direction,
      bed_type,
      img_slider,
    } = dataRoom;
    const split_image_slider = img_slider.split(",");
    console.log(">>> CHECK SPLIT <<<", split_image_slider);
    try {
      const sql = `INSERT INTO rooms (hotel_id, admin_id, name, description, price, number_of_available_rooms, area, view_direction,bed_type, avatar, img_slider) VALUES (?,?, ?, ?, ?,?,?,?,?,?,?)`;
      const [result] = await pool.execute(sql, [
        hotelId,
        admin_id,
        name,
        description,
        price,
        quantity,
        area,
        view_direction,
        bed_type,
        imgPath,
        JSON.stringify(split_image_slider),
      ]);
      resolve("create ok");
    } catch (err) {
      reject(err);
    }
  });
};

let getBookings = (page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    try {
      const limit = pageSize; // Số lượng phòng mỗi trang
      const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
      const [bookingList, fields] = await pool.execute(
        `SELECT * FROM bookings LIMIT ?, ? `,
        [offset, limit]
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

let handleEditRoom = (admin_id, roomId, imgPath, dataRoom) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        id,
        hotel_id,
        name,
        description,
        price,
        number_of_available_rooms,
        area,
        view_direction,
        bed_type,
        img_slider,
      } = dataRoom;
      const split_image_slider = img_slider.split(",");
      console.log(split_image_slider);

      let sql =
        "UPDATE rooms SET admin_id = ?, name = ?, description = ?, price = ?, number_of_available_rooms = ?, area = ?, view_direction = ?, bed_type = ?, img_slider = ?";
      let params = [
        admin_id,
        name,
        description,
        price,
        number_of_available_rooms,
        area,
        view_direction,
        bed_type,
        JSON.stringify(split_image_slider),
      ];

      if (imgPath) {
        sql += ", avatar = ?";
        params.push(imgPath);
      }

      sql += " WHERE id = ?";
      params.push(roomId);

      await pool.execute(sql, params);

      resolve({ message: "update ok" });
    } catch (err) {
      reject(err);
    }
  });
};

let handleEditBooking = (bookingId, dataBooking) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        room_id,
        new_room_id,
        room_name,
        guest_name,
        guest_phone,
        checkin_date,
        checkout_date,
        total_price,
        total_stay,
        guest_mess,
        admin_id,
      } = dataBooking;
      console.log(">>> CHECK DATA BOOKING <<<:", dataBooking);

      // nếu không có new_room_id đc truyền từ client lên thì default là room_id
      let new_room_id_default = new_room_id || room_id;

      console.log(">>> new_room_id_default <<<:", new_room_id_default);

      const [booking] = await pool.query(
        "SELECT * FROM bookings WHERE id = ?",
        [bookingId]
      );
      console.log(">>> CHECK BOOKING <<< ", booking);

      const [room] = await pool.query("SELECT * FROM rooms WHERE id = ?", [
        new_room_id_default,
      ]);
      console.log(">>> CHECK ROOM <<< ", room);

      if (
        room_id !== new_room_id_default &&
        room[0].number_of_available_rooms <= 0
      ) {
        return resolve({ message: "het phong" });
      }

      console.log("test co xuong duoi day không");
      if (room_id !== new_room_id_default) {
        await pool.query(
          "UPDATE rooms SET number_of_available_rooms = number_of_available_rooms + 1 WHERE id = ?",
          [room_id]
        );

        await pool.query(
          "UPDATE rooms SET number_of_available_rooms = number_of_available_rooms - 1 WHERE id = ?",
          [new_room_id_default]
        );
      }

      let sql =
        "UPDATE bookings SET room_id = ?, admin_id = ?, room_name = ?, checkin_date = ?, checkout_date = ?, guest_name = ?,  guest_phone = ?, guest_mess = ?, total_stay = ?, total_price = ?";
      let params = [];

      sql += " WHERE id = ?";
      params.push(
        new_room_id_default,
        admin_id,
        room_name,
        checkin_date,
        checkout_date,
        guest_name,
        guest_phone,
        guest_mess,
        total_stay,
        total_price,
        bookingId
      );

      await pool.execute(sql, params);

      resolve({ message: "update ok" });
    } catch (err) {
      reject(err);
    }
  });
};

let handleDeleteBooking = (bookingId, roomName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [room, field] = await pool.execute(
        `SELECT * FROM rooms WHERE name = ? `,
        [roomName]
      );
      console.log(room);
      const quantityRoom = room[0].number_of_available_rooms;
      const theRestQuantityRoom = quantityRoom + 1;

      await pool.execute(
        "UPDATE rooms SET number_of_available_rooms = ? WHERE name = ?",
        [theRestQuantityRoom, roomName]
      );

      await pool.execute("delete from bookings where id = ?", [bookingId]);

      resolve("xoa ok r do");
    } catch (err) {
      reject(err);
    }
  });
};

let getCustomers = (page = null, pageSize = null, customerId = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = "SELECT id, name, email, disabled  FROM customers ";
      let params = [];
      // console.log(page);
      // console.log(pageSize);
      // console.log(customerId);

      if (page && pageSize) {
        const limit = pageSize; // Số lượng row mỗi trang
        const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
        query += "LIMIT ?, ? ";
        params = [offset, limit];
      } else {
        query += "WHERE id=?";
        params = [customerId];
      }

      const [customerList, fields] = await pool.execute(query, params);
      let total = 0;

      if (page && pageSize) {
        // Truy vấn số lượng phòng
        const [totalUsers, _] = await pool.execute(
          "SELECT COUNT(*) as total FROM customers "
        );
        total = totalUsers[0].total;
      } else {
        total = 1;
      }

      resolve({ customerList, total });
    } catch (err) {
      reject(err);
    }
  });
};

let handleEditCustomer = (customerId, dataCustomer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, admin_id, name, email } = dataCustomer;
      console.log(">>> CHECK DATA CUSTOMER <<<:", dataCustomer);

      if (!(await checkAdminExist(admin_id))) {
        return reject({ error: "admin does not exist" });
      }

      await pool.execute(
        "UPDATE customers SET admin_id = ?, name = ?, email = ? WHERE id = ?",
        [admin_id, name, email, customerId]
      );

      resolve({ message: "update ok" });
    } catch (err) {
      reject(err);
    }
  });
};

let getFAQs = (page = null, pageSize = null, faqId = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = "SELECT * FROM faqs ";
      let params = [];
      // console.log(page);
      // console.log(pageSize);
      // console.log(faqId);

      if (page && pageSize) {
        const limit = pageSize; // Số lượng row mỗi trang
        const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
        query += "LIMIT ?, ? ";
        params = [offset, limit];
      } else {
        query += "WHERE id=?";
        params = [faqId];
      }

      const [faqList, fields] = await pool.execute(query, params);
      let total = 0;
      // console.log(faqList);

      if (page && pageSize) {
        // Truy vấn số lượng phòng
        const [totalFAQs, _] = await pool.execute(
          "SELECT COUNT(*) as total FROM faqs "
        );
        total = totalFAQs[0].total;
      } else {
        total = 1;
      }

      resolve({ faqList, total });
    } catch (err) {
      reject(err);
    }
  });
};

let handleEditFAQ = (faqId, dataFAQ) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, question, answer, disabled, admin_id } = dataFAQ;
      console.log(">>> CHECK DATA FAQ <<<:", dataFAQ);

      await pool.execute(
        "UPDATE faqs SET admin_id = ?, question = ?, answer = ? WHERE id = ?",
        [admin_id, question, answer, faqId]
      );

      resolve({ message: "update ok" });
    } catch (err) {
      reject(err);
    }
  });
};

let getContact = (page = null, pageSize = null, contactId = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = "SELECT * FROM contacts ";
      let params = [];
      // console.log(page);
      // console.log(pageSize);
      // console.log(contactId);

      if (page && pageSize) {
        const limit = pageSize; // Số lượng row mỗi trang
        const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
        query += "LIMIT ?, ? ";
        params = [offset, limit];
      } else {
        query += "WHERE id=?";
        params = [contactId];
      }

      const [contactList, fields] = await pool.execute(query, params);
      let total = 0;
      console.log(contactList);

      if (page && pageSize) {
        // Truy vấn số lượng phòng
        const [totalContact, _] = await pool.execute(
          "SELECT COUNT(*) as total FROM contacts "
        );
        total = totalContact[0].total;
      } else {
        total = 1;
      }

      resolve({ contactList, total });
    } catch (err) {
      reject(err);
    }
  });
};

let getCuisines = (page = null, pageSize = null, cuisineId = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = "SELECT * FROM cuisines ";
      let params = [];

      if (page && pageSize) {
        const limit = pageSize; // Số lượng row mỗi trang
        const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
        query += "LIMIT ?, ? ";
        params = [offset, limit];
      } else {
        query += "WHERE id=?";
        params = [cuisineId];
      }

      const [cuisineList] = await pool.execute(query, params);
      let total = 0;

      if (page && pageSize) {
        // Truy vấn số lượng phòng
        const [totalCuisines, _] = await pool.execute(
          "SELECT COUNT(*) as total FROM cuisines "
        );
        total = totalCuisines[0].total;
      } else {
        total = 1;
      }

      resolve({ cuisineList, total });
    } catch (err) {
      reject(err);
    }
  });
};

let handleCreateCuisine = (hotelId, dataCuisine) => {
  return new Promise(async (resolve, reject) => {
    let {
      name,
      description,
      opening_time,
      closing_time,
      img_slider,
      admin_id,
    } = dataCuisine;
    // console.log(dataCuisine);

    try {
      const sql = `INSERT INTO cuisines (hotel_id, admin_id, name, description, opening_time, closing_time, img_slider) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await pool.execute(sql, [
        hotelId,
        admin_id,
        name,
        description,
        opening_time,
        closing_time,
        JSON.stringify(img_slider),
      ]);
      resolve("create ok");
    } catch (err) {
      reject(err);
    }
  });
};

let handleEditCuisine = (cuisineId, dataCuisine) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        opening_time,
        closing_time,
        description,
        img_slider,
        admin_id,
      } = dataCuisine;
      console.log(">>> CHECK DATA CUISINE <<<:", dataCuisine);

      await pool.execute(
        "UPDATE cuisines SET admin_id = ?, name = ?, opening_time = ?, closing_time = ?, description = ?, img_slider = ? WHERE id = ?",
        [
          admin_id,
          name,
          opening_time,
          closing_time,
          description,
          JSON.stringify(img_slider),
          cuisineId,
        ]
      );

      resolve({ message: "update ok" });
    } catch (err) {
      reject(err);
    }
  });
};

let getServices = (page = null, pageSize = null, serviceId = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = "SELECT * FROM services ";
      let params = [];

      if (page && pageSize) {
        const limit = pageSize; // Số lượng row mỗi trang
        const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
        query += "LIMIT ?, ? ";
        params = [offset, limit];
      } else {
        query += "WHERE id=?";
        params = [serviceId];
      }

      const [serviceList] = await pool.execute(query, params);
      let total = 0;

      if (page && pageSize) {
        // Truy vấn số lượng phòng
        const [totalServices, _] = await pool.execute(
          "SELECT COUNT(*) as total FROM services "
        );
        total = totalServices[0].total;
      } else {
        total = 1;
      }

      resolve({ serviceList, total });
    } catch (err) {
      reject(err);
    }
  });
};

let handleCreateService = (hotelId, dataService) => {
  return new Promise(async (resolve, reject) => {
    let {
      name,
      description,
      opening_time,
      closing_time,
      img_slider,
      admin_id,
    } = dataService;
    // console.log(dataService);

    try {
      const sql = `INSERT INTO services (hotel_id, admin_id, name, description, opening_time, closing_time, img_slider) VALUES (?,?, ?, ?, ?, ?, ?)`;
      const [result] = await pool.execute(sql, [
        hotelId,
        admin_id,
        name,
        description,
        opening_time,
        closing_time,
        JSON.stringify(img_slider),
      ]);
      resolve("create ok");
    } catch (err) {
      reject(err);
    }
  });
};

let handleEditService = (serviceId, dataService) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        opening_time,
        closing_time,
        description,
        img_slider,
        admin_id,
      } = dataService;
      console.log(">>> CHECK DATA SERVICE <<<:", dataService);

      await pool.execute(
        "UPDATE services SET admin_id = ?, name = ?, opening_time = ?, closing_time = ?, description = ?, img_slider = ? WHERE id = ?",
        [
          admin_id,
          name,
          opening_time,
          closing_time,
          description,
          JSON.stringify(img_slider),
          serviceId,
        ]
      );

      resolve({ message: "update ok" });
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

let forgetPasswordAdmin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { name, password, confirmPassword } = data;
      console.log(data);
      let adminData = {};

      let hashPasswordFromBrcypt = await hashAdminPassword(password);
      //   console.log(password);
      //   console.log(hashPasswordFromBrcypt);

      let isExistname = await checkAdminName(name);

      if (!isExistname) {
        adminData.errCode = 1;
        adminData.errMessage = "name nay khong ton tai!!!";
      } else {
        await pool.execute("UPDATE admins SET password = ? WHERE name = ?", [
          hashPasswordFromBrcypt,
          name,
        ]);
        adminData.errCode = 0;
        adminData.errMessage = "ok change password admin success";
      }

      resolve(adminData);
    } catch (e) {
      reject(e);
    }
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
  handleAdminLogin,
  createNewAdmin,
  forgetPasswordAdmin,
  handleEditInfoHotelAdmin,
  createRoom,
  getRooms,
  getBookings,
  handleEditRoom,
  handleEditBooking,
  handleDeleteBooking,
  getCustomers,
  handleEditCustomer,
  getFAQs,
  handleEditFAQ,
  getContact,
  getCuisines,
  handleCreateCuisine,
  handleEditCuisine,
  getServices,
  handleCreateService,
  handleEditService,
};
