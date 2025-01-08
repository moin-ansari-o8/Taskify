import React from "react";
// import "./Card.css";
const Card = ({ title, onClick }) => {
  return (
    <div
      className="cardD-container"
      onClick={onClick}
      onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
    >
      <div>
        <span className="circle">+</span>
      </div>
      <h3 className="card-title">{title}</h3>
    </div>
  );
};

export default Card;
