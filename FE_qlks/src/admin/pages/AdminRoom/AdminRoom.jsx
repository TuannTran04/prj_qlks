import React, { useEffect, useState } from "react";
import {
  getRooms,
  searchRooms,
  deleteRoom,
  activeRoom,
} from "../../services/adminService";
import AdminPagination from "../../features/AdminPagination/AdminPagination";
import "./AdminRoom.css";

const PAGE_SIZE = 5;

const AdminRoom = () => {
  const [rooms, setRooms] = useState([]);
  console.log(rooms);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const newUrl = `${window.location.pathname}?page=${currentPage}`;
  window.history.pushState(null, null, newUrl);

  const handleDeleteRoom = async (roomId) => {
    try {
      console.log(roomId);
      const res = await deleteRoom(roomId);
      console.log(res);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleActiveRoom = async (roomId, roomDisableb) => {
    try {
      // console.log(roomId, roomDisableb);
      const toggleActive = roomDisableb === 0 ? 1 : 0;
      // console.log(toggleActive);
      const res = await activeRoom(roomId, toggleActive);
      console.log(res);
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) => {
          if (room.id === roomId) {
            return {
              ...room,
              disabled: toggleActive,
            };
          }
          return room;
        });
        return updatedRooms;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const renderRoom = async () => {
      try {
        if (searchQuery.trim() !== "") {
          const res = await searchRooms(searchQuery);
          console.log(res);
          setRooms(res.data);
        } else {
          const res = await getRooms(currentPage, PAGE_SIZE);
          // console.log(res.total);
          setRooms(res.data);
          setTotalPages(Math.ceil(res.total / PAGE_SIZE));
        }
      } catch (err) {
        console.log(err);
      }
    };
    renderRoom();
  }, [currentPage, searchQuery]);

  return (
    <div className="adminRoom_page">
      <div className="adminRoom_header">
        <h2>Manage Room</h2>

        <a href="">Add room</a>
      </div>

      <form className="adminRoom_search">
        <label>
          Tìm kiếm phòng:
          <input
            type="text"
            placeholder="search room"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </label>
      </form>

      <div className="adminRoom_wrap_list">
        <div className="adminRoom_list">
          <table className="adminRoom_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên phòng</th>
                <th>Ảnh đại diện</th>
                <th>Số phòng</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {rooms.map((room, id) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.name}</td>
                  <td>
                    <img
                      className="adminRoom_room_img"
                      src="../../assets/room_ks_1.jpg"
                      alt="pic"
                    />
                  </td>
                  <td>{room.number_of_available_rooms}</td>
                  <td>{parseInt(room.price).toLocaleString("en-US")}</td>
                  <td>
                    <span
                      className={
                        room.disabled === 0
                          ? "adminRoom_active"
                          : "adminRoom_disabled"
                      }
                    >
                      {room.disabled === 0 ? "Kích hoạt" : " Bảo trì"}
                    </span>
                  </td>
                  <td className="adminRoom_action">
                    <form action="">
                      <button className="adminRoom_action-edit">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </form>

                    <form action="">
                      <button
                        className="adminRoom_action-delete"
                        onClick={(e) => {
                          e.preventDefault();
                          return handleDeleteRoom(room.id);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </form>

                    <form action="">
                      <button
                        className={
                          room.disabled === 0
                            ? "adminRoom_action-disabled"
                            : "adminRoom_action-active"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          return handleActiveRoom(room.id, room.disabled);
                        }}
                      >
                        {room.disabled === 0 ? (
                          <i className="fa-solid fa-eye-slash"></i>
                        ) : (
                          <i className="fa-solid fa-eye"></i>
                        )}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <AdminPagination
            paginationData={{
              currentPage,
              totalPages,
              newUrl,
              setCurrentPage: setCurrentPage,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminRoom;
