import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminPagination from "../../features/AdminPagination/AdminPagination";
import {
  getBookingsAdmin,
  searchBookingsAdmin,
  deleteBooking,
} from "../../services/adminService";
import "./AdminBooking.css";

const PAGE_SIZE = 5;

const AdminBooking = () => {
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get("page");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  console.log(bookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [totalPages, setTotalPages] = useState(0);

  const newUrl = `${window.location.pathname}?page=${currentPage}`;
  window.history.pushState(null, null, newUrl);

  const handleDeleteBooking = async (bookingId, roomName) => {
    try {
      console.log(bookingId);
      const res = await deleteBooking(bookingId, roomName);
      console.log(res);
      setBookings((prevBookings) =>
        prevBookings.filter((room) => room.id !== bookingId)
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handleConfirmDelete = (bookingId, roomName) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn này không?")) {
      handleDeleteBooking(bookingId, roomName);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const renderBookings = async () => {
      try {
        if (searchQuery.trim() !== "") {
          const res = await searchBookingsAdmin(searchQuery);
          console.log(res);
          setBookings(res.data);
        } else {
          const res = await getBookingsAdmin(currentPage, PAGE_SIZE);
          // console.log(res.total);
          setBookings(res.data);
          setTotalPages(Math.ceil(res.total / PAGE_SIZE));
        }
      } catch (err) {
        console.log(err);
      }
    };
    renderBookings();
  }, [currentPage, searchQuery]);

  // thay đổi page trên url thì update lại data
  useEffect(() => {
    setCurrentPage(parseInt(pageNumber) || 1);
  }, [searchParams]);

  return (
    <div className="adminBooking_page">
      <div className="adminBooking_header">
        <h2>Manage Booking</h2>
      </div>

      <form className="adminBooking_search">
        <label>
          Search Booking:
          <input
            type="text"
            placeholder="search guest name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </label>
      </form>

      <div className="adminBooking_wrap_list">
        <div className="adminBooking_list">
          <table className="adminBooking_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Name</th>
                <th>Guest Name</th>
                <th>Phone</th>
                <th>Checkin</th>
                <th>Checkout</th>
                <th>Message</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking, id) => {
                return (
                  <tr key={booking.id}>
                    <td style={{ maxWidth: "50px" }}>{booking.id}</td>
                    <td style={{ maxWidth: "150px" }}>{booking.room_name}</td>
                    <td style={{ maxWidth: "150px" }}>{booking.guest_name}</td>
                    <td style={{ maxWidth: "150px" }}>{booking.guest_phone}</td>
                    <td style={{ maxWidth: "150px" }}>
                      {moment(booking.checkin_date).format("DD-MM-YYYY")}
                    </td>
                    <td style={{ maxWidth: "150px" }}>
                      {moment(booking.checkout_date).format("DD-MM-YYYY")}
                    </td>
                    <td style={{ maxWidth: "400px" }}>{booking.guest_mess}</td>
                    <td style={{ width: "200px" }}>
                      {parseInt(booking.total_price).toLocaleString("en-US")}
                    </td>
                    <td
                      // style={{ width: "150px" }}
                      className="adminBooking_action"
                    >
                      <form action="">
                        <button
                          className="adminBooking_action-edit"
                          onClick={(e) => {
                            navigate(`/admin/admin-edit-booking/${booking.id}`);
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      </form>

                      <form action="">
                        <button
                          className="adminBooking_action-delete"
                          onClick={(e) => {
                            e.preventDefault();
                            return handleConfirmDelete(
                              booking.id,
                              booking.room_name
                            );
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
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

export default AdminBooking;
