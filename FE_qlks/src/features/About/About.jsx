import clsx from "clsx";
import React from "react";
import styles from "./About.module.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className={styles.exceed_container}>
      <div className={styles.exceed_contain}>
        <div className={styles.exceed_content}>
          <div className={styles.exceed_left}>
            <h2>I'm Ready to Exceed Expectations</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum
              lorem imperdiet
            </p>
            <Link to="/rooms">More</Link>
          </div>
        </div>
        <div className={styles.wrap_img}>
          <img
            className={styles.exceed_img}
            src="/assets/room_ks_3.jpg"
            alt="img"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
