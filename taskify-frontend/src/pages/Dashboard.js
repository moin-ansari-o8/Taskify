import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import axios from "axios";

// Modal and DeleteConfirmModal components remain unchanged, so I’ll skip them here for brevity
const Modal = ({ showModal, onClose, title, onSubmit, initialTitle = "" }) => {
  const [boardName, setBoardName] = useState(initialTitle);

  useEffect(() => {
    if (showModal) setBoardName(initialTitle);
  }, [showModal, initialTitle]);

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

const DeleteConfirmModal = ({ showModal, onClose, onConfirm }) => {
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
              Confirm Deletion
            </h5>
            <button
              type="button"
              className="btn-close position-absolute end-0 me-3"
              onClick={onClose}
            ></button>
          </div>
          <div
            className="modal-body p-4 text-center"
            style={{ color: "rgb(85, 49, 23)" }}
          >
            Are you sure you want to delete this board?
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button
              className="btn btn-danger btn-lg rounded-pill px-4 mx-2"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-secondary btn-lg rounded-pill px-4 mx-2"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

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
  const handleBoardClick = (boardId) => navigate(`/cards?boardId=${boardId}`);
  const handleEditClick = (board) => {
    setSelectedBoard(board);
    setShowEditModal(true);
  };
  const handleDeleteClick = (board) => {
    setSelectedBoard(board);
    setShowDeleteModal(true);
  };

  const handleSubmitCreate = (boardName) => {
    const loggedInUsername = localStorage.getItem("username");
    axios
      .post("http://localhost:8000/boards/", {
        board_title: boardName || "Untitled Board",
        username: loggedInUsername,
      })
      .then((response) => {
        setBoards([...boards, response.data.board]);
      })
      .catch((error) =>
        alert(error.response?.data.error || "Something went wrong!")
      );
  };

  const handleSubmitEdit = (boardName) => {
    const loggedInUsername = localStorage.getItem("username");
    axios
      .patch(`http://localhost:8000/boards/${selectedBoard.id}/`, {
        board_title: boardName || "Untitled Board",
        username: loggedInUsername,
      })
      .then((response) => {
        setBoards(
          boards.map((b) => (b.id === selectedBoard.id ? response.data : b))
        );
        setSelectedBoard(null);
      })
      .catch((error) => alert("Failed to update board!"));
  };

  const handleDeleteBoard = () => {
    const loggedInUsername = localStorage.getItem("username");
    axios
      .delete(`http://localhost:8000/boards/${selectedBoard.id}/`, {
        params: { username: loggedInUsername },
      })
      .then(() => {
        setBoards(boards.filter((b) => b.id !== selectedBoard.id));
        setSelectedBoard(null);
      })
      .catch((error) => alert("Failed to delete board!"));
  };

  const closeModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedBoard(null);
  };

  return (
    <div className="container min-vh-100 py-5">
      <div
        className="text-start mb-3 justify-content-center d-flex"
        style={{ padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      >
        <p
          className="lead text-muted"
          style={{ fontWeight: "bold", fontSize: "1.75rem" }}
        >
          {boards.length > 0 ? "Your Boards" : "Let’s create your first board!"}
        </p>
      </div>

      <div className="row g-4 justify-content-center ps-3">
        {/* List existing boards */}
        {boards.map((board) => (
          <div key={board.id} className="col-lg-3 col-md-4 col-sm-6">
            <Card
              title={board.board_title}
              onClick={() => handleBoardClick(board.id)}
              className="w-100 h-100"
              style={{ border: "none", background: "rgba(255, 248, 231, 0.8)" }}
            >
              {/* Button container with hover visibility */}
              <div className="card-buttons">
                <button
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
                    border: "1px solid",
                    color: "brown",
                    height: "30px",
                    width: "30px",
                    borderRadius: "30%",
                    padding: "0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(board);
                  }}
                >
                  <i className="bi bi-pencil" style={{ fontSize: "1rem" }}></i>
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
                    border: "1px solid",
                    color: "#4A2F1A",
                    height: "30px",
                    width: "30px",
                    borderRadius: "30%",
                    padding: "0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(board);
                  }}
                >
                  <i className="bi bi-trash" style={{ fontSize: "1rem" }}></i>
                </button>
              </div>
            </Card>
          </div>
        ))}

        {/* Add Board Card */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
          <Card
            title="Add Board"
            onClick={handleCardClick}
            showCircle="1"
            style={{ marginLeft: "2rem" }}
          />
        </div>
      </div>

      <Modal
        showModal={showModal}
        onClose={closeModal}
        title="Create Board"
        onSubmit={handleSubmitCreate}
      />
      <Modal
        showModal={showEditModal}
        onClose={closeModal}
        title="Edit Board"
        onSubmit={handleSubmitEdit}
        initialTitle={selectedBoard?.board_title || ""}
      />
      <DeleteConfirmModal
        showModal={showDeleteModal}
        onClose={closeModal}
        onConfirm={handleDeleteBoard}
      />
    </div>
  );
};

export default Dashboard;
