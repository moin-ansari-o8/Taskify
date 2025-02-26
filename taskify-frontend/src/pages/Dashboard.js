import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "../components/Card";
import axios from "axios";

// Modal Component
const Modal = ({ showModal, onClose, title, onSubmit }) => {
  const [boardName, setBoardName] = useState("");

  if (!showModal) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg rounded-3"
          style={{
            background: "linear-gradient(135deg, rgb(146, 113, 89), #C8B19A)",
          }}
        >
          <div className="modal-header border-0">
            <h5
              className="modal-title mx-auto fw-bold"
              style={{
                color: "rgb(85, 49, 23)",
                fontSize: "1.8rem",
                fontFamily: "'Pacifico', cursive",
              }}
            >
              {title}
            </h5>
            <button
              type="button"
              className="btn-close position-absolute end-0 me-3"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-4">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill shadow-sm"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
            />
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button
              className="btn btn-success btn-lg rounded-pill px-5"
              onClick={() => {
                onSubmit(boardName);
                setBoardName("");
                onClose();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loggedInUsername = localStorage.getItem("username");
    if (loggedInUsername) {
      axios
        .get("http://localhost:8000/boards/", {
          params: { username: loggedInUsername },
        })
        .then((response) => setBoards(response.data))
        .catch((error) => alert(`Error fetching boards: ${error.message}`));
    }
  }, []);

  const handleCardClick = () => setShowModal(true);

  const handleBoardClick = (boardId) => {
    navigate(`/cards?boardId=${boardId}`); // Navigate to /cards with query param
  };

  const handleSubmit = (boardName) => {
    const loggedInUsername = localStorage.getItem("username");
    axios
      .post("http://localhost:8000/boards/", {
        board_title: boardName || "Untitled Board",
        username: loggedInUsername,
      })
      .then((response) => {
        console.log("Board created:", response.data);
        setBoards([...boards, response.data.board]); // Update boards list
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error); // Show alert for duplicate or other errors
        } else {
          console.error("Error creating board:", error);
          alert("Something went wrong while creating the board!");
        }
      });
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="container min-vh-100 py-5">
      <div
        className="text-start mb-5 justify-content-center d-flex"
        style={{ padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      >
        <p
          className="lead text-muted"
          style={{ fontWeight: "bold", fontSize: "1.75rem" }}
        >
          {boards.length > 0 ? "Your Boards" : "Let’s create your first board!"}
        </p>
      </div>

      <div className="row g-4">
        {/* List existing boards */}
        {boards.map((board) => (
          <div key={board.id} className="col-lg-3 col-md-4 col-sm-6">
            <Card
              title={board.board_title}
              onClick={() => handleBoardClick(board.id)} // Navigate to /cards
              className="shadow-sm bg-white text-dark rounded-3"
              style={{
                height: "150px",
                display: "flex",
                alignItems: "center",
                background: "rgba(255, 248, 231, 0.8)",
                justifyContent: "center",
              }}
            />
          </div>
        ))}

        {/* Add Board Card */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
          <Card title="Add Board" onClick={handleCardClick} showCircle="1" />
        </div>
      </div>

      <Modal
        showModal={showModal}
        onClose={closeModal}
        title="Create Board"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Dashboard;
