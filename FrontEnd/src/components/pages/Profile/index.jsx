import React from "react";
import TopBar from "../../organisms/TopBar";
import BottomBar from "../../organisms/BottomBar";
import BabyProfile from "../../organisms/Profile";
// import Sensor from "../../organisms/Sensor";

// import { useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import SensorDataPage from "../../organisms/Sensor/index";

function Profile() {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/");
  };

  return (
    <div className="font-new">
      <TopBar />
      <div className="h-screen pb-16">
        <BabyProfile />
        {/* <Sensor/> */}
        <SensorDataPage/>
      </div>
      <BottomBar />
    </div>
  );
}

export default Profile;
