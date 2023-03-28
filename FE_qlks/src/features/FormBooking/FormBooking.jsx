import React, { useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import moment from "moment";
import "./FormBooking.css";
import { createBookings } from "../../services/roomService";

const FormBooking = ({ infoBooking }) => {
  const [form, setFormValue] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { name, email, phone, message } = form;

  console.log(infoBooking);
  const {
    roomId,
    nameRoom,
    checkin,
    checkout,
    children,
    adults,
    stayDays,
    stayNights,
    stayMoney,
    quantity,
  } = infoBooking;

  const totalGuests = `${adults} người lớn${
    children > 0 ? ` ${children} trẻ em` : ""
  }`;
  // console.log(totalGuests);
  const totalStay = `${stayDays} ngày ${stayNights} đêm`;
  // console.log(totalStay);
  const totalPrice = stayMoney + (stayMoney * 10) / 100;
  // console.log(totalPrice);

  const handleChange = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;

    setFormValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => {
    // Regex kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    console.log(form);
    if (!name || !email || !phone) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!isValidEmail(email)) {
      // Nếu email không đúng định dạng, hiển thị thông báo lỗi
      alert("Email không đúng định dạng");
      return;
    }

    const minusRoom = quantity > 0 ? quantity - 1 : 0;

    const dataBooking = {
      roomId,
      name,
      email,
      phone,
      message,
      nameRoom,
      checkin,
      checkout,
      totalGuests,
      totalStay,
      totalPrice,
      quantityRoom: minusRoom,
    };

    try {
      e.preventDefault();

      const response = await createBookings(dataBooking);
      console.log(response);
      alert("booking success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>Thông tin khách hàng</h2>
      <form action="">
        <div className="booking_form_field">
          <h4>
            Họ và tên <span className="required">*</span>
          </h4>
          <input name="name" type="text" onChange={handleChange} />
        </div>

        <div className="booking_form_row">
          <div className="booking_form_field">
            <h4>
              Email <span className="required">*</span>
            </h4>
            <input name="email" type="email" onChange={handleChange} />
          </div>

          <div className="booking_form_field">
            <h4>
              Điện thoại <span className="required">*</span>
            </h4>
            <input name="phone" type="text" onChange={handleChange} />
          </div>
        </div>

        <div className="booking_form_field">
          <h4>Ghi chú</h4>
          <textarea
            name="message"
            id=""
            cols="30"
            rows="5"
            placeholder="Vui lòng ghi thêm yêu cầu của bạn ở đây, chúng tôi sẽ chuẩn bị trước khi bạn đến nhận phòng"
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          className="booking_form_btn"
          type="button"
          onClick={handleSubmit}
        >
          Xác nhận
        </button>
      </form>
    </>
  );
};

export default FormBooking;
