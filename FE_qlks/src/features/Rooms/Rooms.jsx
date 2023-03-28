import clsx from "clsx";
import React from "react";
import styles from "./Rooms.module.css";

const Rooms = () => {
  const arrRooms = [
    {
      id: 1,
      heading: "Phong khach san",
      para: "Voi dien tich 30m2, mang den khong gian sang trong thoai mai...",
      imgLink: "room_ks_3.jpg",
    },
    {
      id: 2,
      heading: "Phong khach san",
      para: "Voi dien tich 40m2, mang den khong gian sang trong thoai mai...",
      imgLink: "room_ks_3.jpg",
    },
    {
      id: 3,
      heading: "Phong khach san",
      para: "Voi dien tich 50m2, mang den khong gian sang trong thoai mai...",
      imgLink: "room_ks_3.jpg",
    },
  ];
  return (
    <div className={styles.plan_contain}>
      <div className={styles.plan_header}>
        <div className={styles.plan_header_center}>
          <h2>Choose a plan</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare, eros dolor interdum nulla, ut commodo diam libero
            vitae erat.
          </p>
        </div>
      </div>

      <div className={styles.plan_price}>
        {arrRooms.map((room, i) => (
          <div key={i} className={styles.plan_item}>
            <div className={styles.plan_top}>
              <img src={`/assets/${room.imgLink}`} alt={`plan_cam_${i}`} />
            </div>
            <div className={styles.plan_mid}>
              <h2>{room.heading}</h2>
              <p>{room.para}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
