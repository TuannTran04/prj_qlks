import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomersAdmin, editCustomer } from "../../services/adminService";
import "./AdminCustomerEdit.css";

const AdminCustomerEdit = () => {
  const { customerId } = useParams();
  // console.log(customerId);
  // const navigate = useNavigate();
  // console.log(roomId);

  const [form, setFormValue] = useState({
    id: 0,
    email: "",
    name: "",
  });
  console.log(form);

  const { id, email, name } = form;

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
    if (!email || !name) {
      alert("Nhập đầy đủ các trường");
      return;
    }
    try {
      const formData = form;
      console.log(formData);

      const response = await editCustomer(formData, customerId);
      console.log(response);
      alert(response.message);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCustomersAdmin(null, null, customerId);
        console.log(res);
        if (res.data.length === 0) {
          throw new Error("khong co customer nay");
        } else {
          setFormValue(...res.data);
        }

        // setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [customerId]);

  return (
    <div className="adminEditCustomer_page">
      <div className="adminEditCustomer_header">
        <h2>Edit Customer</h2>
      </div>

      <div className="adminEditCustomer_wrap_form">
        <div className="adminEditCustomer_form">
          <div className="adminEditCustomer_form_fill">
            <label htmlFor="">ID</label>
            <input
              type="text"
              name="userId"
              onChange={handleChange}
              placeholder="1"
              value={id}
              readOnly
            />
          </div>
          <div className="adminEditCustomer_form_fill">
            <label htmlFor="">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="user@gmail.com"
              value={email}
            />
          </div>
          <div className="adminEditCustomer_form_fill">
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="user123"
              value={name}
            />
          </div>
        </div>
        <div className="adminEditCustomer_wrap_btn">
          <button className="adminEditCustomer_btn" onClick={handleSubmitForm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerEdit;
