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
        quantityRoom,
      } = dataBooking;
      console.log(dataBooking);

      if (!dataBooking) {
        return resolve({ error: "Room not found" });
      }

      if (quantityRoom === 0) {
        return resolve({ error: "No room available" });
      }

      await pool.execute(
        "UPDATE rooms SET number_of_available_rooms = ? WHERE name = ?",
        [quantityRoom, nameRoom]
      );

      const sql = `INSERT INTO bookings (room_id, room_name, checkin_date, checkout_date, guest_name, guest_email, guest_phone, guest_mess, total_stay, total_guests, total_price) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await pool.execute(sql, [
        roomId,
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

// EXPORTS
module.exports = {
  getRooms,
  handleDataBooking,
};
