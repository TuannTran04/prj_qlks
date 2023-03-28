import React, { useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import moment from "moment";
import "./FormDetail.css";

const FormDetail = ({ roomData }) => {
  // dung` de redirect va save data tu page nay sang page khac
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);
  // console.log(today);

  const [form, setFormValue] = useState({
    checkin: today,
    checkout: today,
    adults: 0,
    children: 0,
  });
  console.log(form);

  const { checkin, checkout, adults, children } = form;

  const handleChange = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    if (name === "checkin" || name === "checkout") {
      // format lại giá trị ngày tháng nhập vào theo định dạng dd-mm-yyyy
      const [day, month, year] = value.split("-");
      const formattedValue = `${day}-${month}-${year}`;
      console.log(formattedValue);

      setFormValue((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else {
      // xử lý với input number
      setFormValue((prevState) => ({
        ...prevState,
        [name]: parseInt(value),
      }));
    }
  };

  const checkinDate = moment(checkin);
  const checkoutDate = moment(checkout);
  //   console.log(checkoutDate);

  // Tính số ngày
  const stayDays = checkoutDate.diff(checkinDate, "days") + 1;
  // Tính số đêm
  let stayNights = stayDays - 1;
  if (checkoutDate.hour() >= 12) {
    stayNights--;
  }
  //   console.log(checkoutDate.hour());
  // Tính số tiền
  const stayMoney = stayDays * roomData.price;
  console.log(stayMoney);

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission behavior

    if (localStorage.getItem("info-user")) {
      // Kiểm tra số lượng phòng còn lại
      if (roomData.number_of_available_rooms <= 0) {
        alert("het phong");
      } else {
        // kiểm tra checkin không được bằng hoặc lớn hơn checkout
        if (moment(checkin).isSameOrAfter(moment(checkout))) {
          alert("Ngày nhận phòng phải trước ngày trả phòng");
          return;
        }

        // kiểm tra checkout không được bé hơn hoặc bằng checkin
        if (moment(checkout).isSameOrBefore(moment(checkin))) {
          alert("Ngày trả phòng phải sau ngày nhận phòng");
          return;
        }

        // Kiểm tra số lượng người lớn
        if (adults <= 0) {
          alert("Số lượng người lớn phải lớn hơn 0");
          return;
        }

        // nếu kiểm tra qua các điều kiện trên thành công, tiếp tục submit form
        console.log("Form submitted:", form);

        navigate("/booking", {
          state: {
            roomId: roomData.id,
            nameRoom: roomData.name,
            checkin,
            checkout,
            adults,
            children,
            stayMoney,
            stayDays,
            stayNights,
            quantity: roomData.number_of_available_rooms,
          },
        });
      }
    } else {
      alert("Đăng nhập để sử dụng chức năng này");
      navigate("/login");
    }
  };

  return (
    <>
      <div className="detail_form">
        <div className="detail_form_top">
          <p>Giá chỉ từ</p>
          <span className="detail_form_top_price">
            {parseFloat(roomData.price).toLocaleString("en-US", {
              style: "currency",
              currency: "VND",
            })}
          </span>
          <p>/ ngày</p>
        </div>

        <div className="detail_form_bottom">
          <form action="">
            <div className="detail_form_field">
              <p>NGÀY NHẬN PHÒNG</p>
              <input
                type="date"
                name="checkin"
                value={checkin}
                min={today}
                onChange={handleChange}
              />
            </div>
            <div className="detail_form_field">
              <p>NGÀY TRẢ PHÒNG</p>
              <input
                type="date"
                name="checkout"
                value={checkout}
                min={today}
                onChange={handleChange}
              />
            </div>
            <div className="detail_form_field">
              <p>NGƯỜI LỚN</p>
              <input
                type="number"
                name="adults"
                min="0"
                step="1"
                placeholder="0"
                value={adults}
                onChange={handleChange}
              />
            </div>
            <div className="detail_form_field">
              <p>TRẺ EM</p>
              <input
                type="number"
                name="children"
                min="0"
                step="1"
                placeholder="0"
                value={children}
                onChange={handleChange}
              />
            </div>
            <div className="detail_form_btn">
              <Link to="/reservation" onClick={handleSubmit}>
                ĐẶT NGAY
              </Link>
            </div>
          </form>
        </div>

        <div className="detail_form_preview">
          <h2>PREVIEW</h2>
          <div className="detail_form_estimate">
            <div className="detail_form_estimate-left">
              <p>Thời gian</p>
              <p>Tổng tiền</p>
            </div>

            <div className="detail_form_estimate-right">
              <p>
                {stayDays || "..."} ngày {stayNights || "..."} đêm
              </p>
              <p>{stayMoney.toLocaleString("en-US")} VNĐ</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormDetail;
