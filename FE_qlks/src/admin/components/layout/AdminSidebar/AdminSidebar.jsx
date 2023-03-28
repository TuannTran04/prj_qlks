import React from "react";
import { Link } from "react-router-dom";
import { arrTab } from "./AdminSidebarConst";
import "./AdminSidebar.css";

const AdminSidebar = ({ location }) => {
  const currentPath = location.pathname;

  const getTabClass = (tabPath) => {
    return tabPath === currentPath ? "active" : "";
  };

  return (
    <div className="adminSidebar">
      <div className="adminSidebar_menu">
        <ul>
          <li className={getTabClass("/admin")}>
            <Link to="/admin">
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </Link>
          </li>
          <li className="adminSidebar_list_devider"></li>

          {arrTab.map((tab, i) => (
            <li key={i} className={getTabClass(tab.path)}>
              <Link to={tab.path}>
                <i className={tab.icon}></i>
                <span>{tab.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
