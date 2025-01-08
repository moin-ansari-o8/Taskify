import React from "react";
import { FaCog } from "react-icons/fa"; // Settings icon
import { IoMdGrid } from "react-icons/io"; // Dashboard icon
import { AiOutlineAppstore } from "react-icons/ai"; // Boards icon
import { BsCheckCircle } from "react-icons/bs"; // Tasks icon
import { Link } from "react-router-dom"; // Use Link for routing
// import "./SideBar.css";

const SideBar = ({ isCollapsed, toggleSidebar }) => {
  const renderItem = (name, icon, path, isDivider = "dvd") => {
    return (
      <li className="sidebar-item">
        <Link to={path}>
          {!isCollapsed ? (
            <>
              <span className="text">{name}</span>
            </>
          ) : (
            <>
              <span className="icon">{icon}</span>
            </>
          )}
        </Link>
        {isDivider === "dvd" && <div className="divider"></div>}
      </li>
    );
  };

  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : ""} text-center`}
      style={{
        transition: "width 0.3s ease", // Smooth width transition
      }}
    >
      <button className="toggle-btn" onClick={toggleSidebar}>
        <strong>&#x2630;</strong>
      </button>

      <ul
        style={{
          listStyle: "none",
          padding: "0",
          margin: "80px 0 0 0",
        }}
      >
        {renderItem("Dashboard", <IoMdGrid />, "/dashboard")}
        {renderItem("Boards", <AiOutlineAppstore />, "/boards")}
        {renderItem("Tasks", <BsCheckCircle />, "/tasks")}
        {renderItem("Settings", <FaCog />, "/settings", "dvd-not")}
      </ul>
    </div>
  );
};

export default SideBar;
