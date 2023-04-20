import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AccountPagination from "../../components/layout/AccountPagination/AccountPagination";
import {
  getBookingsAccount,
  searchBookingsAccount,
} from "../../services/userService";
import "./HistoryBookingPage.css";

const PAGE_SIZE = 5;

const HistoryBookingPage = () => {
  const user_id = localStorage.getItem("info-user")
    ? JSON.parse(localStorage.getItem("info-user")).id
    : "";
  console.log(user_id);
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

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const renderBookings = async () => {
      try {
        if (searchQuery.trim() !== "") {
          const res = await searchBookingsAccount(searchQuery, user_id);
          console.log(res);
          setBookings(res.data);
        } else {
          const res = await getBookingsAccount(currentPage, PAGE_SIZE, user_id);
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
    <div className="historyBooking_page">
      <div className="historyBooking_header">
        <h2>History Booking</h2>
      </div>

      <form className="historyBooking_search">
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

      <div className="historyBooking_wrap_list">
        <div className="historyBooking_list">
          <table className="historyBooking_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Name</th>
                <th>Guest Name</th>
                <th>Guest Email</th>
                <th>Phone</th>
                <th>Checkin</th>
                <th>Checkout</th>
                <th>Message</th>
                <th>Total Price</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking, id) => {
                return (
                  <tr key={booking.id}>
                    <td style={{ maxWidth: "50px" }}>{booking.id}</td>
                    <td style={{ maxWidth: "150px" }}>{booking.room_name}</td>
                    <td style={{ maxWidth: "150px" }}>{booking.guest_name}</td>
                    <td style={{ maxWidth: "250px" }}>{booking.guest_email}</td>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AccountPagination
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

export default HistoryBookingPage;
