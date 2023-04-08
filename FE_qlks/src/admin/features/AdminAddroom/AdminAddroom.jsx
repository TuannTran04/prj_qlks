import React, { useRef, useState } from "react";
import { addRoomAdmin } from "../../services/adminService";
import "./AdminAddroom.css";

const AdminAddroom = () => {
  const [form, setFormValue] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    area: "",
    view_direction: "",
    bed_type: "",
    image: null,
    img_slider: ["", "", "", "", ""],
  });
  // console.log(form);
  const inputRefFile = useRef(null);

  const {
    name,
    description,
    price,
    quantity,
    area,
    view_direction,
    bed_type,
    image,
    img_slider,
  } = form;
  // console.log(img_slider.length);

  const handleChange = (e) => {
    // console.log([e.target]);
    const { name, value } = e.target;
    if (name === "image") {
      setFormValue((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    } else {
      setFormValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSliderImageChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "img_slider") {
      const images = [...form.img_slider];
      images[index] = value;
      setFormValue((prev) => ({ ...prev, [name]: images }));
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !area ||
      !view_direction ||
      !bed_type ||
      !image ||
      img_slider.length !== 5 ||
      img_slider.some((item) => item.trim() === "")
    ) {
      alert("Nhập đầy đủ các trường");
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "image") {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      console.log(...formData.entries());
      // console.log(formData);

      const response = await addRoomAdmin(formData);
      console.log(response);
      alert(response.message);
      setFormValue({
        name: "",
        description: "",
        price: "",
        quantity: "",
        area: "",
        view_direction: "",
        bed_type: "",
        image: null,
        img_slider: ["", "", "", "", ""],
      });
      inputRefFile.current.value = "";
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className="adminAddRoom_page">
      <div className="adminAddRoom_header">
        <h2>Add Room</h2>
      </div>
      <div className="adminAddRoom_wrap_form">
        <div className="adminAddRoom_form">
          <div className="adminAddRoom_form_fill">
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Chill out"
              value={form.name}
            />
          </div>
          <div className="adminAddRoom_form_fill">
            <label htmlFor="">Price</label>
            <input
              name="price"
              type="text"
              onChange={handleChange}
              placeholder="6320000"
              value={form.price}
            />
          </div>
          <div className="adminAddRoom_form_fill">
            <label htmlFor="">Quantity</label>
            <input
              name="quantity"
              type="text"
              onChange={handleChange}
              placeholder="0"
              value={form.quantity}
            />
          </div>
          <div className="adminAddRoom_form_fill">
            <label htmlFor="">Area</label>
            <input
              name="area"
              type="text"
              onChange={handleChange}
              placeholder="10m2"
              value={form.area}
            />
          </div>
          <div className="adminAddRoom_form_fill">
            <label htmlFor="">View direction</label>
            <input
              name="view_direction"
              type="text"
              onChange={handleChange}
              placeholder="hướng..."
              value={form.view_direction}
            />
          </div>
          <div className="adminAddRoom_form_fill">
            <label htmlFor="">Bed type</label>
            <input
              name="bed_type"
              type="text"
              onChange={handleChange}
              placeholder="twin"
              value={form.bed_type}
            />
          </div>
          <div className="adminAddRoom_form_fill">
            <label htmlFor="">Image</label>
            <input
              ref={inputRefFile}
              name="image"
              type="file"
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="adminAddRoom_form_fill">
            <label>Slider Images Link (x5)</label>

            <input
              type="text"
              name="img_slider"
              placeholder="Link..."
              value={img_slider[0] || ""}
              onChange={(e) => {
                e.preventDefault();
                handleSliderImageChange(e, 0);
              }}
            />
            <input
              type="text"
              name="img_slider"
              placeholder="Link..."
              value={img_slider[1] || ""}
              onChange={(e) => {
                e.preventDefault();
                handleSliderImageChange(e, 1);
              }}
            />
            <input
              type="text"
              name="img_slider"
              placeholder="Link..."
              value={img_slider[2] || ""}
              onChange={(e) => {
                e.preventDefault();
                handleSliderImageChange(e, 2);
              }}
            />
            <input
              type="text"
              name="img_slider"
              placeholder="Link..."
              value={img_slider[3] || ""}
              onChange={(e) => {
                e.preventDefault();
                handleSliderImageChange(e, 3);
              }}
            />
            <input
              type="text"
              name="img_slider"
              placeholder="Link..."
              value={img_slider[4] || ""}
              onChange={(e) => {
                e.preventDefault();
                handleSliderImageChange(e, 4);
              }}
            />
          </div>
          <div className="adminAddRoom_form_fill">
            <label htmlFor="">Description</label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="5"
              onChange={handleChange}
              placeholder="phòng hiện đại với các tiện nghi...."
              value={form.description}
            ></textarea>
          </div>
        </div>
        <div className="adminAddRoom_wrap_btn">
          <button className="adminAddRoom_btn" onClick={handleSubmitForm}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddroom;
