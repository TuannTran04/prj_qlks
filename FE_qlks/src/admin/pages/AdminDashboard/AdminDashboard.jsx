import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../../components/layout/AdminHeader/AdminHeader";
import AdminSidebar from "../../components/layout/AdminSidebar/AdminSidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const location = useLocation();
  const isHome = location.pathname === "/admin";
  return (
    <div>
      <AdminHeader />
      <AdminSidebar location={location} />
      <div className="dashboard_page">
        <div className="dashboard_wrap_content">
          <div className="dashboard_content">
            {isHome ? <h1>This is the Home Page</h1> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
