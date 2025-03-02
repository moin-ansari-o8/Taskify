import React from "react";
const NotificationBell = () => {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <i className="bi bi-bell" style={{ fontSize: "20px" }}></i>
    </span>
  );
};
export default NotificationBell;
