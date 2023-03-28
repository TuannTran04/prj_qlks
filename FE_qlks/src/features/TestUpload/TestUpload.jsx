import React, { useState } from "react";
import axios from "../../utils/axios";

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  let roomIdVariable = "2";
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      console.log(formData);
      console.log(...formData.entries());

      const res = await axios.post("/api/v1/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          roomName: "Deluxe Sky",
        },
      });
      console.log(res);

      setImagePath(res.imagePath);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {imagePath && <img src={"http://localhost:9090" + imagePath} alt="pic" />}
    </div>
  );
}

export default ImageUploader;
