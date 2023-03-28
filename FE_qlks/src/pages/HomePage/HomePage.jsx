import React from "react";
import Footer from "../../components/layout/Footer/Footer";
import GotoUp from "../../components/layout/GotoUp/GotoUp";
import Header from "../../components/layout/Header/Header";
import About from "../../features/About/About";
import Facilities from "../../features/Facilities/Facilities";
import Rooms from "../../features/Rooms/Rooms";
import SliderComponent from "../../features/Slider/Slider";
import SliderIns from "../../features/SliderIns/SliderIns";
import style from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={style.test_home}>
      <Header />
      <SliderComponent />
      <GotoUp />
      <About />
      <Rooms />
      <Facilities />
      <SliderIns />
      <Footer />
    </div>
  );
};

export default HomePage;
