import clsx from "clsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { arrIconSoc, arrInputForm } from "./LoginConst";
import { handleLogin } from "../../services/userService";
import "./LoginPage.css";

const LoginPage = (props) => {
  const navigate = useNavigate();
  const [form, setFormValue] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  // console.log(form);
  const { email, password, rememberMe } = form;

  const inputPasswordRef = useRef();
  // console.log(inputPasswordRef);

  // get info in page register when regis succes then remember to fill in login form
  const location = useLocation();
  // console.log(location.state);

  // show err when err
  const [errMessage, setErrMessage] = useState("");
  // console.log(errMessage);

  // set value form when input change
  const handleChange = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    if (name === "rememberMe") {
      setFormValue((prevState) => ({
        ...prevState,
        rememberMe: !rememberMe,
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
    setErrMessage("");
    // console.log(form);
    try {
      e.preventDefault();
      // setFormValue((prevState) => ({
      //   ...prevState,
      //   email: "",
      //   password: "",
      // }));
      const response = await handleLogin(email, password);
      // console.log(response);

      if (response && response.errCode) {
        setErrMessage(response.message);
      } else {
        // logic when login success
        localStorage.setItem("info-user", JSON.stringify(response.user));
        window.location.href = "/";
        navigate("/", { state: { userId: response.user.id } });
        alert("login success");
        // console.log("login success");
      }
    } catch (error) {
      console.log(error);
      setErrMessage(error.message || error.response.data.message);
    }
  };

  // Prefill inputs if redirected from the register page
  useEffect(() => {
    if (location.state) {
      localStorage.removeItem("remember-me");
      setFormValue((prevState) => ({
        ...prevState,
        ...location.state,
      }));
    }
  }, [location.state]);

  // Check có rememberData không và trong rememberData email password có phải là truthy không
  useEffect(() => {
    const rememberData = JSON.parse(localStorage.getItem("remember-me"));
    if (rememberData?.email && rememberData?.password) {
      setFormValue((prevState) => ({
        ...prevState,
        ...rememberData,
        rememberMe: true,
      }));
    }
  }, []);

  // Chỉ lưu vào local khi input được fill đầy đủ và có checkbox
  useEffect(() => {
    if (rememberMe && email && password) {
      localStorage.setItem("remember-me", JSON.stringify(form));
    } else {
      localStorage.removeItem("remember-me");
    }
  }, [form]);

  return (
    <div className="login_page">
      <div className="login_background"></div>

      <div className="login_container">
        <div className="login_item">
          <h2 className="login_logo">
            <i className="bx bxl-xing"></i>TUAN TRAN
          </h2>

          <div className="login_text-item">
            <h2>
              Welcome! <br />
              <span>To Kim Tuyen Hotel</span>
            </h2>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit,
              repellendus?
            </p>

            <div className="login_social-icon">
              {arrIconSoc.map((item, i) => (
                <a key={i} href="#">
                  <i className={item}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={clsx("login-section")}>
          <div className="form-box login">
            <form action="">
              <h2>Sign In</h2>

              {arrInputForm.map((item, i) => {
                if (item.name !== "name") {
                  return (
                    <div key={i} className="input-box">
                      <span className="login_icon">
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
                      <label className="login_label">{item.nameLabel}</label>
                      {item.name === "password" && (
                        <span
                          className="login_icon_show"
                          onClick={handleShowPassword}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </span>
                      )}
                    </div>
                  );
                }
              })}

              <div className="remember-password">
                <label htmlFor="">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={handleChange}
                  />
                  Remember Me
                </label>
                <Link to="/forget-password">Forget Password</Link>
              </div>

              <div style={{ textAlign: "center", color: "red" }}>
                {errMessage}
              </div>

              <button className="login_btn" onClick={handleSubmit}>
                Login In
              </button>

              <div className="create-account">
                <p>
                  Create A New Account?{" "}
                  <Link to="/register" className="register-link">
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

export default LoginPage;
