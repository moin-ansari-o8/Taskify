import React from "react";
// import logo from "./toggle1.png";
import { FaCog } from "react-icons/fa"; // Settings icon
import { IoMdGrid } from "react-icons/io"; // Dashboard icon
import { AiOutlineAppstore } from "react-icons/ai"; // Boards icon
import { BsCheckCircle } from "react-icons/bs"; // Tasks icon
import "./SideBar.css";

const SideBar = ({ isCollapsed, toggleSidebar }) => {
  const renderItem = (name, icon, isDivider = "dvd") => {
    return (
      <li className="sidebar-item">
        <a href="#">
          {!isCollapsed ? (
            <>
              <span className="text">{name}</span>
            </>
          ) : (
            <>
              <span className="icon">{icon}</span>
            </>
          )}
        </a>
        {/* Conditional rendering for divider */}
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
      <button className="toggle-btn " onClick={toggleSidebar}>
        <strong>&#x2630;</strong>
        {/* <img src={logo} alt="toggle" width="30" height="24" /> */}
      </button>

      <ul
        style={{
          listStyle: "none",
          padding: "0",
          margin: "80px 0 0 0",
        }}
      >
        {renderItem("Dashboard", <IoMdGrid />)}
        {renderItem("Boards", <AiOutlineAppstore />)}
        {renderItem("Tasks", <BsCheckCircle />)}
        {renderItem("Settings", <FaCog />, "dvd-not")}
      </ul>
    </div>
  );
};

export default SideBar;
