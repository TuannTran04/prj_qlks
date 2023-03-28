import React from "react";
import Slider from "react-slick";
import { useLocation, useParams, Link } from "react-router-dom";
import "./DetailPage.css";
import { SliderDetail } from "../../features/SliderDetail/SliderDetail";
import TabsDetail from "../../features/TabsDetail/TabsDetail";
import FormDetail from "../../features/FormDetail/FormDetail";

const DetailPage = () => {
  // get param id on path
  const { id, name } = useParams();
  console.log(id, name);

  const location = useLocation();
  console.log(location.state);

  const roomData = location.state && location.state.roomData;
  console.log(roomData);
  // Check if location state exists
  if (!roomData) {
    return <div>Loading...</div>;
  }
  console.log(location.state.roomData);

  return (
    <div className="detail_page">
      {/* <div>{id}</div> */}
      <div className="detail_top">
        <div className="detail_top_img"></div>
        <div className="detail_top_intro">
          <h2 className="detail_top_heading">{roomData.name}</h2>
          <p className="detail_top_para">Phòng nghỉ</p>
        </div>
      </div>

      <div className="detail_container">
        <div className="detail_item">
          <div className="detail_item_left">
            <SliderDetail />
          </div>

          <div className="detail_item_right">
            <FormDetail roomData={roomData} />
          </div>
        </div>

        <hr style={{ opacity: 0.4 }} />

        <TabsDetail />

        <hr style={{ opacity: 0.4 }} />
      </div>
    </div>
  );
};

export default DetailPage;
