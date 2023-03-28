import React, { useState } from "react";
// import styles from "./Slider.module.css";
import "./Slider.css";
import clsx from "clsx";
import Slider from "react-slick";

// import { baseUrl } from "./config";

// export default class SliderComponent extends React.Component {
//   state = {
//     slideIndex: 0,
//   };

//   render() {
//     let arrImg = [
//       { id: 1, imgLink: "/assets/room_ks_1.jpg" },
//       { id: 2, imgLink: "/assets/room_ks_1.jpg" },
//       { id: 2, imgLink: "/assets/room_ks_1.jpg" },
//     ];
//     const settings = {
//       dots: true,
//       infinite: true,
//       speed: 500,
//       slidesToShow: 1,
//       slidesToScroll: 1,
//       autoplaySpeed: 2000,
//       afterChange: () =>
//         this.setState((state) => ({ updateCount: state.updateCount + 1 })),
//       beforeChange: (current, next) => this.setState({ slideIndex: next }),
//     };
//     return (
//       <div>
//         <Slider ref={(slider) => (this.slider = slider)} {...settings}>
//           {arrImg.map((img, i) => (
//             <div key={i}>
//               <img
//                 className={clsx(styles.item_img)}
//                 src={img.imgLink}
//                 alt={img.id}
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>
//     );
//   }
// }
// function SampleNextArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", background: "red" }}
//       onClick={onClick}
//     />
//   );
// }

// function SamplePrevArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", background: "green" }}
//       onClick={onClick}
//     />
//   );
// }

class SliderComponent extends React.Component {
  render() {
    const arrSlider = ["slider_1.jpg", "room_ks_1.jpg", "room_ks_2.jpg"];
    let settings = {
      dots: true,
      className: "sample ",
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      //   nextArrow: <SampleNextArrow />,
      //   prevArrow: <SamplePrevArrow />,
    };
    return (
      <Slider {...settings}>
        {arrSlider.map((item, i) => (
          <div key={i} className="slider_item">
            <div className="wrap_slide_img">
              <img className="item_img" src={`/assets/${item}`} />
            </div>
            {item === "slider_1.jpg" && (
              <div className="slider_intro">
                <h2>Kim Tuyến Hotel</h2>
                <p>Xin kính chào quý khách</p>
              </div>
            )}
          </div>
        ))}
        {/* <div className="wrap_slide_img">
          <img className="item_img" src="/assets/room_ks_1.jpg" />
        </div>
        <div className="wrap_slide_img">
          <img className="item_img" src="/assets/room_ks_2.jpg" />
        </div>
        <div className="wrap_slide_img">
          <img className="item_img" src="/assets/room_ks_3.jpg" />
        </div> */}
      </Slider>
    );
  }
}

export default SliderComponent;
