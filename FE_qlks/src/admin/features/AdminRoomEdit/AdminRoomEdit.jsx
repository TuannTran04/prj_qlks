import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomEdit, editRoom } from "../../services/adminService";
import "./AdminRoomEdit.css";

const AdminEditRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  // console.log(roomId);
  const [form, setFormValue] = useState({
    name: "",
    description: "",
    price: "",
    number_of_available_rooms: "",
    area: "",
    view_direction: "",
    bed_type: "",
    image: "",
    imageUrlTemp: "",
    avatar: "",
    img_slider: ["", "", "", "", ""],
  });
  console.log(form);

  const inputRefFile = useRef(null);
  const {
    name,
    description,
    price,
    number_of_available_rooms,
    area,
    view_direction,
    bed_type,
    image,
    imageUrlTemp,
    avatar,
    img_slider,
  } = form;

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

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setFormValue((prevState) => ({
        ...prevState,
        imageUrlTemp: url,
      }));
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !price ||
      isNaN(number_of_available_rooms) ||
      Number(number_of_available_rooms) < 0 ||
      !area ||
      !view_direction ||
      !bed_type ||
      !avatar ||
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
      console.log(formData);

      const response = await editRoom(formData, roomId);
      console.log(response);
      alert(response.message);
      inputRefFile.current.value = "";
      navigate("/admin/admin-room");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRoomEdit(roomId);
        const newRes = {
          ...res.data,
          img_slider: JSON.parse(res.data.img_slider),
        };

        setFormValue((prevState) => ({
          ...prevState,
          ...newRes,
        }));
        // setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [roomId]);

  return (
    <div className="adminEditRoom_page">
      <div className="adminEditRoom_header">
        <h2>Edit Room</h2>
      </div>
      <div className="adminEditRoom_wrap_form">
        <div className="adminEditRoom_form">
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Chill out"
              value={name}
            />
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Price</label>
            <input
              name="price"
              type="text"
              onChange={handleChange}
              placeholder="6320000"
              value={price}
            />
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Quantity</label>
            <input
              name="number_of_available_rooms"
              type="text"
              onChange={handleChange}
              placeholder="0"
              value={number_of_available_rooms}
            />
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Area</label>
            <input
              name="area"
              type="text"
              onChange={handleChange}
              placeholder="10m2"
              value={area}
            />
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">View direction</label>
            <input
              name="view_direction"
              type="text"
              onChange={handleChange}
              placeholder="hướng..."
              value={view_direction}
            />
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Bed type</label>
            <input
              name="bed_type"
              type="text"
              onChange={handleChange}
              placeholder="twin"
              value={bed_type}
            />
          </div>
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Image</label>
            <input
              name="image"
              type="file"
              onChange={handleChange}
              placeholder=""
              ref={inputRefFile}
            />
            "Current img:"
            {avatar && (
              <img
                style={{
                  width: "250px",
                  height: "200px",
                  objectFit: "cover",
                  display: "flex",
                  margin: "5px auto 0",
                }}
                src={image ? imageUrlTemp : `http://localhost:9090${avatar}`}
                alt={avatar}
              />
            )}
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
          <div className="adminEditRoom_form_fill">
            <label htmlFor="">Description</label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="5"
              onChange={handleChange}
              placeholder="phòng hiện đại với các tiện nghi...."
              value={description}
            ></textarea>
          </div>
        </div>
        <div className="adminEditRoom_wrap_btn">
          <button className="adminEditRoom_btn" onClick={handleSubmitForm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditRoom;
