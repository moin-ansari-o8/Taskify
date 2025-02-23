import React, { useState } from "react";
import Card from "../components/Card";

// Modal Component
const Modal = ({ showModal, onClose, title, onSubmit }) => {
  const [taskName, setTaskName] = useState("");

  const handleChange = (event) => setTaskName(event.target.value);

  return showModal ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <input
          type="text"
          value={taskName}
          onChange={handleChange}
          placeholder="Enter board name"
        />
        <button
          onClick={() => {
            onSubmit(taskName);
            onClose();
          }}
        >
          Submit
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  ) : null;
};

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [taskType, setTaskType] = useState("");

  const handleCardClick = (action) => {
    setModalTitle(`Create ${action}`);
    setTaskType(action);
    setShowModal(true);
  };

  const handleSubmit = (taskName) => {
    console.log(`${taskType} Name: ${taskName}`);
    // Handle task creation logic later
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1 className="welcome-text">
          Welcome to{" "}
          <i style={{ fontFamily: "'Pacifico', cursive" }}>TASKIFY</i>!
        </h1>
        <p className="sub-welcome-text">Choose an action to get started:</p>
      </div>
      <div className="card-container">
        <Card
          title="Create To-do(s)"
          onClick={() => handleCardClick("To-do(s)")}
        />
        <Card
          title="Create Schedule"
          onClick={() => handleCardClick("Schedule")}
        />
        <Card
          title="Create Project"
          onClick={() => handleCardClick("Project")}
        />
      </div>

      {/* Modal Component */}
      <Modal
        showModal={showModal}
        onClose={closeModal}
        title={modalTitle}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Dashboard;
