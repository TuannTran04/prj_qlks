import React, { useState } from "react";
import "./ChangePasswordPage.css";
import { changePasswordUser } from "../../services/userService";

const ChangePasswordPage = () => {
  const user_id = localStorage.getItem("info-user")
    ? JSON.parse(localStorage.getItem("info-user")).id
    : "";

  const [form, setFormValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  console.log(form);

  const { oldPassword, newPassword, confirmNewPassword } = form;

  const handleChange = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert("Nhập đầy đủ các trường");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const formData = form;
      console.log(formData);

      const response = await changePasswordUser(formData, user_id);
      console.log(response);
      alert(response.message);

      setFormValue((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (error) {
      console.log(error);
      alert(error.response.data.err.err || "EDIT error");
    }
  };

  return (
    <div className="changePassword_page">
      <div className="changePassword_header">
        <h2>Change Password</h2>
      </div>

      <div className="changePassword_wrap_form">
        <div className="changePassword_form">
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Old Password</label>
            <input
              name="oldPassword"
              onChange={handleChange}
              placeholder="..."
              value={oldPassword}
            ></input>
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">New Password</label>
            <input
              name="newPassword"
              onChange={handleChange}
              placeholder="..."
              value={newPassword}
            ></input>
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Confirm New Password</label>
            <input
              name="confirmNewPassword"
              onChange={handleChange}
              placeholder="..."
              value={confirmNewPassword}
            ></input>
          </div>
        </div>
        <div className="changePassword_wrap_btn">
          <button className="changePassword_btn" onClick={handleSubmitForm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
