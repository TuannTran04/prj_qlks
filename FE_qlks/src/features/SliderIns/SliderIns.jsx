import clsx from "clsx";
import React, { Component } from "react";
import "./SliderIns.css";
import Slider from "react-slick";
// import styles from "./SliderSmall.module.css";

// const SliderIns = () => {
//   const arrIns = [
//     "room_ks_1.jpg",
//     "room_ks_2.jpg",
//     "room_ks_3.jpg",
//     "rooms_pic_1.png",
//     "rooms_pic_1.png",
//   ];

//   return (
//     <div className="ins_img">
//       {arrIns.map((item, i) => {
//         return (
//           <div className="ins_item">
//             <img src={`assets/${item}`} alt={`ins_img_${i + 1}`} />
//             <div className="ins_overlay">
//               <div className="ins_overlay_content">
//                 <a href="#">
//                   <i className="fa-brands fa-instagram"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
//};

export default class SliderIns extends Component {
  render() {
    const arrIns = [
      "room_ks_1.jpg",
      "room_ks_2.jpg",
      "room_ks_3.jpg",
      "rooms_pic_1.png",
      "rooms_pic_1.png",
      "rooms_pic_1.png",
      "rooms_pic_1.png",
    ];

    const settings = {
      className: "slider_ins",
      // dots: true,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: false,
      swipeToSlide: true,
      // draggable: true,
    };
    return (
      <div className="ins_container">
        <Slider {...settings}>
          {arrIns.map((item, i) => {
            return (
              <div key={i} className="ins_item">
                <img src={`assets/${item}`} alt={`ins_img_${i + 1}`} />
                <div className="ins_overlay">
                  <div className="ins_overlay_content">
                    <a href="#">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
}

// export default SliderIns;
