import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { arrIconSoc, arrInputForm } from "./AdminLoginConst";
import { handleAdminLogin } from "../../services/adminService";
import "./AdminLogin.css";

const AdminLogin = ({ onLogin }) => {
  const [form, setFormValue] = useState({
    name: "",
    password: "",
    rememberAdmin: JSON.parse(localStorage.getItem("remember-admin"))
      ? true
      : false,
  });
  // console.log(form);
  const { name, password, rememberAdmin } = form;

  const inputPasswordRef = useRef();
  // console.log(inputPasswordRef);

  // get info in page register when regis succes then remember to fill in login form
  const location = useLocation();
  // console.log(location.state);

  // show err when err
  const [errMessage, setErrMessage] = useState("");
  //   console.log(errMessage);

  // set value form when input change
  const handleChange = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    if (name === "rememberAdmin") {
      setFormValue((prevState) => ({
        ...prevState,
        rememberAdmin: !rememberAdmin,
      }));
    } else {
      setFormValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // show pass when click icon eye
  const handleShowPassword = (e) => {
    if (inputPasswordRef.current) {
      inputPasswordRef.current.type =
        inputPasswordRef.current.type === "password" ? "text" : "password";
    }
  };

  // post data from client to server and get respone data from server
  const handleSubmit = async (e) => {
    // e.preventDefault();
    setErrMessage("");
    console.log(form);
    try {
      e.preventDefault();
      const response = await handleAdminLogin(name, password);
      console.log(response);

      if (response && response.errCode) {
        setErrMessage(response.message);
      } else {
        // logic when login success
        localStorage.setItem("info-admin", JSON.stringify(response.admin));
        onLogin();
        // window.location.href = "/admin";
        alert("login success");
        console.log("login success");
      }
    } catch (error) {
      console.log(error);
      setErrMessage(error.message || error.response.data.message);
    }
  };

  // Prefill inputs if redirected from the register page
  useEffect(() => {
    if (location.state) {
      setFormValue((prevState) => ({
        ...prevState,
        ...location.state,
      }));
    }

    if (rememberAdmin) {
      setFormValue((prevState) => ({
        ...prevState,
        ...JSON.parse(localStorage.getItem("remember-admin")),
      }));
    }
  }, [location.state]);

  useEffect(() => {
    if (rememberAdmin) {
      localStorage.setItem("remember-admin", JSON.stringify(form));
    } else {
      localStorage.removeItem("remember-admin");
    }
  }, [form]);

  return (
    <div className="adminLogin_page">
      <div className="adminLogin_background"></div>

      <div className="adminLogin_container">
        <div className="adminLogin_item">
          <h2 className="adminLogin_logo">
            <i className="bx bxl-xing"></i>Hash Techie
          </h2>

          <div className="adminLogin_text-item">
            <h2>
              Welcome! <br />
              <span>To Kim Tuyen Hotel</span>
            </h2>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit,
              repellendus?
            </p>

            <div className="adminLogin_social-icon">
              {arrIconSoc.map((item, i) => (
                <a key={i} href="#">
                  <i className={item}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={clsx("adminLogin-section")}>
          <div className="formAdminLogin-box adminLogin">
            <form action="">
              <h2>Sign In</h2>

              {arrInputForm.map((item, i) => {
                if (item.name !== "email") {
                  return (
                    <div key={i} className="inputAdminLogin-box">
                      <span className="adminLogin_icon">
                        <i className={item.icon}></i>
                      </span>
                      <input
                        ref={item.name === "password" ? inputPasswordRef : null}
                        type={item.type}
                        name={item.name}
                        value={form[item.name]}
                        required
                        onChange={handleChange}
                      />
                      <label className="adminLogin_label">
                        {item.nameLabel}
                      </label>
                      {item.name === "password" && (
                        <span
                          className="adminLogin_icon_show"
                          onClick={handleShowPassword}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </span>
                      )}
                    </div>
                  );
                }
              })}

              <div className="rememberAdmin-password">
                <label htmlFor="">
                  <input
                    type="checkbox"
                    name="rememberAdmin"
                    checked={rememberAdmin}
                    onChange={handleChange}
                  />
                  Remember Me
                </label>
                {/* <a href="#">Forget Password</a> */}
              </div>

              <div style={{ textAlign: "center", color: "red" }}>
                {errMessage}
              </div>

              <button className="adminLogin_btn" onClick={handleSubmit}>
                Login In
              </button>

              <div className="createAdmin-account">
                <p>
                  Create A New Account?{" "}
                  <Link to="/admin/register" className="registerAdmin-link">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
