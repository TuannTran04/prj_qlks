import React, { useEffect, useState } from "react";
import "./ChangeInfoPage.css";
import { changeInfoUser, getUser } from "../../services/userService";

const ChangeInfoPage = () => {
  const user_id = localStorage.getItem("info-user")
    ? JSON.parse(localStorage.getItem("info-user")).id
    : "";

  const [form, setFormValue] = useState({
    id: 0,
    name: "",
    email: "",
  });
  console.log(form);

  const { id, name, email } = form;

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
    if (!name || !email) {
      alert("Nhập đầy đủ các trường");
      return;
    }
    try {
      const formData = form;
      console.log(formData);

      const response = await changeInfoUser(formData, user_id);
      console.log(response);
      alert(response.message);
    } catch (error) {
      console.log(error);
      alert(error.response.data.error || "EDIT error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser(user_id);
        console.log(res);
        if (res.data.length === 0) {
          throw new Error("khong co user nay");
        } else {
          // setFormValue(...res.data);
          setFormValue((prevState) => ({
            ...prevState,
            ...res.data,
          }));
        }

        // setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user_id]);

  return (
    <div className="changeInfo_page">
      <div className="changeInfo_header">
        <h2>Change Info</h2>
      </div>

      <div className="changeInfo_wrap_form">
        <div className="changeInfo_form">
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Name</label>
            <input
              name="name"
              onChange={handleChange}
              placeholder="..."
              value={name}
            ></input>
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Email</label>
            <input
              name="email"
              onChange={handleChange}
              placeholder="..."
              value={email}
            ></input>
          </div>
        </div>
        <div className="changeInfo_wrap_btn">
          <button className="changeInfo_btn" onClick={handleSubmitForm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeInfoPage;
