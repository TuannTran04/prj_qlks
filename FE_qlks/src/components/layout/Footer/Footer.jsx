import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_top">
        <h2 className="footer_top_h2">Liên hệ với chúng tôi</h2>
      </div>
      <div className="footer_bottom">
        <div className="footer_bottom_item">
          <h2>Kim Tuyến Hotel</h2>
          <p>Địa chỉ: 102/6 - quận 12 - Tp.HCM</p>
          <p>Số điện thoại: {"(+84) 123 4567 999"}</p>
        </div>

        <div className="footer_bottom_item">
          <h2>Hỗ trợ khách hàng</h2>
          <p>Hỗ trợ 24/7</p>
          <p>
            <i className="fa-solid fa-phone"></i> {"(+84) 123 4567 999"}
          </p>
        </div>

        <div className="footer_bottom_item">
          <p className="footer_bottom_psoc">
            Liên kết mạng xã hội của chúng tôi
          </p>
          <ul className="footer_bottom_socials">
            <li>
              <a href="#">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer_copyright">
        <p>
          Copyright ©2023 All rights reserved | This template is made with{" "}
          <i className="fa-solid fa-heart"></i> by
          <span> Tuan Tran</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
