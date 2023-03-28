import React from "react";
import "./SliderDetail.css";
import Slider from "react-slick";

class SliderDetail extends React.Component {
  render() {
    const settings = {
      customPaging: function (i) {
        return (
          <a>
            <img src={`/assets/room_ks_${i + 1}.jpg`} />
          </a>
        );
      },
      className: "slider_detail",
      dots: true,
      dotsClass: "slick-dots slick-thumb",
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div>
        <Slider {...settings}>
          <div className="slider_detail_item">
            <img src="/assets/room_ks_1.jpg" />
          </div>
          <div className="slider_detail_item">
            <img src="/assets/room_ks_2.jpg" />
          </div>
          <div className="slider_detail_item">
            <img src="/assets/room_ks_3.jpg" />
          </div>
          <div className="slider_detail_item">
            <img src="/assets/room_ks_4.jpg" />
          </div>
          <div className="slider_detail_item">
            <img src="/assets/room_ks_5.jpg" />
          </div>
        </Slider>
      </div>
    );
  }
}

export { SliderDetail };
