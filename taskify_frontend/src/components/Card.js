import React from "react";
// import "./Card.css";
const Card = React.forwardRef(
  ({ title, onClick, showCircle, className, style, children }, ref) => {
    return (
      <div
        className="cardD-container"
        style={{
          ...style, // Apply default background if no background in style
        }}
        onClick={onClick}
      >
        {showCircle && (
          <div>
            <span className="circle">+</span>
          </div>
        )}
        <h3 className="card-title">{title}</h3>
        {children}
      </div>
    );
  }
);
export default Card;
