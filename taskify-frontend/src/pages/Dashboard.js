import React from "react";
import Card from "../components/Card";
// import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
  // Handle card click actions
  const handleCardClick = (action) => {
    alert(`You clicked on: ${action}`);
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1 className="welcome-text">
          Welcome to{" "}
          <i>
            <u>Taskify</u>{" "}
          </i>
          !
        </h1>
        <p className="sub-welcome-text">Choose an action to get started:</p>
      </div>

      <div className="card-container">
        <Card
          title="Create To-do(s)"
          onClick={() => handleCardClick("Create To-do(s)")}
        />
        <Card
          title="Create Schedule"
          onClick={() => handleCardClick("Create Schedule")}
        />
        <Card
          title="Create Project"
          onClick={() => handleCardClick("Create Project")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
