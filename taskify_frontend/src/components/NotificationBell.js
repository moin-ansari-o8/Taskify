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
      <span
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          backgroundColor: "#4A2F1A",
          color: "white",
          borderRadius: "50%",
          padding: "2px 5px",
          fontSize: "9px",
          fontWeight: "bold",
        }}
      >
        3 {/* Example notification count */}
      </span>
    </span>
  );
};
export default NotificationBell;
