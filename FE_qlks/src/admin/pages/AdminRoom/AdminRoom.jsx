import React, { useEffect, useState } from "react";
import {
  getRoomsAdmin,
  searchRoomsAdmin,
  deleteRoom,
  activeRoom,
} from "../../services/adminService";
import AdminPagination from "../../features/AdminPagination/AdminPagination";
import "./AdminRoom.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PAGE_SIZE = 5;

const AdminRoom = () => {
  const admin_id = localStorage.getItem("info-admin")
    ? JSON.parse(localStorage.getItem("info-admin")).id
    : "";
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get("page");
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  console.log(rooms);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [totalPages, setTotalPages] = useState(0);

  const newUrl = `${window.location.pathname}?page=${currentPage}`;
  window.history.pushState(null, null, newUrl);

  const handleDeleteRoom = async (roomId) => {
    try {
      console.log(roomId);
      const res = await deleteRoom(roomId, admin_id);
      console.log(res);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (err) {
      console.log(err);
      alert(err.response.data.error || "DELETE error");
    }
  };
  const handleConfirmDelete = (roomId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
      handleDeleteRoom(roomId);
    }
  };

  const handleActiveRoom = async (roomId, roomDisableb) => {
    try {
      // console.log(roomId, roomDisableb);
      const toggleActive = roomDisableb === 0 ? 1 : 0;
      // console.log(toggleActive);
      const res = await activeRoom(roomId, toggleActive, admin_id);
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
      alert(err.response.data.error || "ACTIVE error");
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const renderRoom = async () => {
      try {
        if (searchQuery.trim() !== "") {
          const res = await searchRoomsAdmin(searchQuery);
          console.log(res);
          setRooms(res.data);
        } else {
          const res = await getRoomsAdmin(currentPage, PAGE_SIZE);
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

  // thay đổi page trên url thì update lại data
  useEffect(() => {
    setCurrentPage(parseInt(pageNumber) || 1);
  }, [searchParams]);

  return (
    <div className="adminRoom_page">
      <div className="adminRoom_header">
        <h2>Manage Room</h2>
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
        <Link to="/admin/admin-add-room">Add room</Link>
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
                      // src="../../assets/room_ks_1.jpg"
                      src={`http://localhost:9090${room.avatar}`}
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
                      <button
                        className="adminRoom_action-edit"
                        onClick={(e) => {
                          navigate(`/admin/admin-edit-room/${room.id}`);
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </form>

                    <form action="">
                      <button
                        className="adminRoom_action-delete"
                        onClick={(e) => {
                          e.preventDefault();
                          return handleConfirmDelete(room.id);
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
        </div>
        <AdminPagination
          paginationData={{
            currentPage,
            totalPages,
            setCurrentPage: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
};

export default AdminRoom;
