import pool from "../configs/connectDB";
// import bcrypt from "bcryptjs";
// var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("B4c0//", salt);

let getRooms = (page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    try {
      const limit = pageSize; // Số lượng phòng mỗi trang
      const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
      // const [rows, fields] = await pool.execute("SELECT * FROM rooms");
      const [roomList, fields] = await pool.execute(
        `SELECT * FROM rooms WHERE disabled = 0 LIMIT ?, ? `,
        [offset, limit]
      );
      // Truy vấn số lượng phòng
      const [totalRooms, _] = await pool.execute(
        "SELECT COUNT(*) as total FROM rooms WHERE disabled = 0"
      );
      const total = totalRooms[0].total;
      console.log(total);
      resolve({ roomList, total });
    } catch (err) {
      reject(err);
    }
  });
};

let handleDataBooking = (dataBooking) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        roomId,
        userId,
        nameRoom,
        checkin,
        checkout,
        name,
        email,
        phone,
        message,
        totalStay,
        totalGuests,
        totalPrice,
      } = dataBooking;
      console.log(dataBooking);

      const [room] = await pool.execute(`SELECT * FROM rooms WHERE id = ? `, [
        roomId,
      ]);
      // console.log(room);

      const quantityRoom = parseInt(room[0].number_of_available_rooms);
      console.log(">>> CHECK QUANTITY ROOM <<<", quantityRoom);

      const [user] = await pool.execute(
        `SELECT * FROM customers WHERE id = ? `,
        [userId]
      );
      console.log(">>> CHECK USER EXIST <<<:", user);

      if (user.length === 0) {
        return reject({ error: "user does not exist" });
      }

      if (room.length === 0) {
        return reject({ error: "Room not found" });
      }

      if (quantityRoom === 0) {
        return reject({ error: "No room available" });
      }

      const theRestQuantityRoom = quantityRoom > 0 ? quantityRoom - 1 : 0;
      console.log(">>> CHECK REST QUANTITY ROOM <<<", theRestQuantityRoom);

      await pool.execute(
        "UPDATE rooms SET number_of_available_rooms = ? WHERE name = ?",
        [theRestQuantityRoom, nameRoom]
      );

      const sql = `INSERT INTO bookings (room_id, customer_id, room_name, checkin_date, checkout_date, guest_name, guest_email, guest_phone, guest_mess, total_stay, total_guests, total_price) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await pool.execute(sql, [
        roomId,
        userId,
        nameRoom,
        checkin,
        checkout,
        name,
        email,
        phone,
        message,
        totalStay,
        totalGuests,
        totalPrice,
      ]);

      resolve("ok r do");
    } catch (err) {
      reject(err);
    }
  });
};

let getCuisines = (page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    try {
      const limit = pageSize; // Số lượng phòng mỗi trang
      const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
      const [cuisineList, fields] = await pool.execute(
        `SELECT * FROM cuisines WHERE disabled = 0 LIMIT ?, ? `,
        [offset, limit]
      );
      // Truy vấn số lượng phòng
      const [totalCuisines, _] = await pool.execute(
        "SELECT COUNT(*) as total FROM cuisines WHERE disabled = 0"
      );
      const total = totalCuisines[0].total;
      console.log(total);
      resolve({ cuisineList, total });
    } catch (err) {
      reject(err);
    }
  });
};

let getServices = (page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    try {
      const limit = pageSize; // Số lượng phòng mỗi trang
      const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
      const [serviceList, fields] = await pool.execute(
        `SELECT * FROM services WHERE disabled = 0 LIMIT ?, ? `,
        [offset, limit]
      );
      // Truy vấn số lượng phòng
      const [totalServices, _] = await pool.execute(
        "SELECT COUNT(*) as total FROM services WHERE disabled = 0"
      );
      const total = totalServices[0].total;
      console.log(total);
      resolve({ serviceList, total });
    } catch (err) {
      reject(err);
    }
  });
};

// EXPORTS
module.exports = {
  getRooms,
  handleDataBooking,
  getCuisines,
  getServices,
};
