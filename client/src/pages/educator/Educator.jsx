import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";
import Footer from "../../components/educator/Footer";

const Educator = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        {/* All nested components will render here */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Educator;
