import React from "react";
// import "./Card.css";
const Card = React.forwardRef(
  ({ title, onClick, showCircle, className, style }, ref) => {
    return (
      <div
        className="cardD-container"
        style={{
          ...style, // Apply default background if no background in style
          transition: "transform 0.2s ease", // Smooth scaling
        }}
        onClick={onClick}
      >
        {showCircle && (
          <div>
            <span className="circle">+</span>
          </div>
        )}
        <h3 className="card-title">{title}</h3>
      </div>
    );
  }
);
export default Card;
