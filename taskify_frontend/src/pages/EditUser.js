import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const { username } = useParams();
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { type: "board" | "card" | "task", id: number }
  const navigate = useNavigate();

  // Fetch boards on mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("http://localhost:8000/boards/", {
          params: { username },
        });
        setBoards(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load boards.");
        setLoading(false);
      }
    };
    fetchBoards();
  }, [username]);

  // Fetch cards when a board is selected
  useEffect(() => {
    if (selectedBoardId) {
      const fetchCards = async () => {
        try {
          const response = await axios.get("http://localhost:8000/cards/", {
            params: { username, board_id: selectedBoardId },
          });
          setCards(response.data);
          setTasks([]);
          setSelectedCardId(null);
        } catch (err) {
          setError("Failed to load cards.");
        }
      };
      fetchCards();
    }
  }, [selectedBoardId, username]);

  // Fetch tasks when a card is selected
  useEffect(() => {
    if (selectedCardId) {
      const fetchTasks = async () => {
        try {
          const response = await axios.get("http://localhost:8000/tasks/", {
            params: { card_id: selectedCardId },
          });
          setTasks(response.data);
        } catch (err) {
          setError("Failed to load tasks.");
        }
      };
      fetchTasks();
    }
  }, [selectedCardId]);

  // Handle board click (select board)
  const handleBoardClick = (boardId) => {
    setSelectedBoardId(boardId);
  };

  // Handle card click (select card)
  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
  };

  // Handle task click (placeholder for future edit functionality)
  const handleTaskClick = (taskId) => {
    console.log(`Task ${taskId} clicked - edit functionality TBD`);
    // Add task edit logic here if needed
  };

  // Handle back to cards
  const handleBackToCards = () => {
    setSelectedCardId(null);
    setTasks([]);
  };

  // Handle delete confirmation
  const openDeleteModal = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "board") {
        await axios.delete(`http://localhost:8000/boards/${itemToDelete.id}/`, {
          params: { username },
        });
        setBoards(boards.filter((board) => board.id !== itemToDelete.id));
        if (selectedBoardId === itemToDelete.id) {
          setSelectedBoardId(null);
          setCards([]);
          setTasks([]);
          setSelectedCardId(null);
        }
      } else if (itemToDelete.type === "card") {
        await axios.delete(`http://localhost:8000/cards/${itemToDelete.id}/`, {
          params: { username },
        });
        setCards(cards.filter((card) => card.id !== itemToDelete.id));
        if (selectedCardId === itemToDelete.id) {
          setSelectedCardId(null);
          setTasks([]);
        }
      } else if (itemToDelete.type === "task") {
        await axios.delete(`http://localhost:8000/tasks/${itemToDelete.id}/`);
        setTasks(tasks.filter((task) => task.id !== itemToDelete.id));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      setError(`Failed to delete ${itemToDelete.type}.`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container min-vh-100 py-5">
      {/* Header */}
      <div
        className="text-center mb-5"
        style={{
          padding: "15px",
          background: "linear-gradient(135deg, #5B3A29, #8C4F30)",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 className="display-5 text-white">Manage {username}'s Boards</h1>
        <button
          className="btn btn-light mt-3"
          onClick={() => navigate("/admin-dashboard")}
        >
          Back to Admin Dashboard
        </button>
      </div>

      {/* Two Containers */}
      <div className="row">
        {/* Left Container - Boards */}
        <div className="col-md-6 mb-4">
          <div
            className="card"
            style={{
              background: "linear-gradient(to bottom, #FFF8E7, #E8D3B9)",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              height: "500px",
              overflowY: "auto",
            }}
          >
            <div className="card-body">
              <h4
                className="card-title text-center"
                style={{ color: "#4A2F1A" }}
              >
                Boards
              </h4>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-muted" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : boards.length === 0 ? (
                <p className="text-center text-muted">No boards found.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {boards.map((board) => (
                    <li
                      key={board.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ background: "transparent", border: "none" }}
                    >
                      <span
                        style={{ color: "#4A2F1A", cursor: "pointer" }}
                        onClick={() => handleBoardClick(board.id)}
                      >
                        {board.board_title}
                      </span>
                      <i
                        className="bi bi-trash"
                        style={{ cursor: "pointer", color: "#DC3545" }}
                        onClick={() => openDeleteModal("board", board.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Container - Cards/Tasks */}
        <div className="col-md-6 mb-4">
          <div
            className="card"
            style={{
              background: "linear-gradient(to bottom, #FFF8E7, #E8D3B9)",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              height: "500px",
              overflowY: "auto",
            }}
          >
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center position-relative">
                {selectedCardId && (
                  <i
                    className="bi bi-arrow-left position-absolute start-0 ms-3"
                    style={{
                      cursor: "pointer",
                      color: "#4A2F1A",
                      fontSize: "1.5rem",
                    }}
                    onClick={handleBackToCards}
                  />
                )}
                <h4
                  className="card-title text-center"
                  style={{ color: "#4A2F1A" }}
                >
                  {selectedCardId ? "Tasks" : "Cards"}
                </h4>
              </div>
              {!selectedBoardId ? (
                <p className="text-center text-muted mt-5">
                  Click a board title from the left to view its cards.
                </p>
              ) : selectedCardId ? (
                tasks.length === 0 ? (
                  <p className="text-center text-muted">No tasks found.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{ background: "transparent", border: "none" }}
                      >
                        <span
                          style={{ color: "#4A2F1A", cursor: "pointer" }}
                          onClick={() => handleTaskClick(task.id)}
                        >
                          {task.task_title}
                        </span>
                        <i
                          className="bi bi-trash"
                          style={{ cursor: "pointer", color: "#DC3545" }}
                          onClick={() => openDeleteModal("task", task.id)}
                        />
                      </li>
                    ))}
                  </ul>
                )
              ) : cards.length === 0 ? (
                <p className="text-center text-muted">No cards found.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {cards.map((card) => (
                    <li
                      key={card.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ background: "transparent", border: "none" }}
                    >
                      <span
                        style={{ color: "#4A2F1A", cursor: "pointer" }}
                        onClick={() => handleCardClick(card.id)}
                      >
                        {card.card_title}
                      </span>
                      <i
                        className="bi bi-trash"
                        style={{ cursor: "pointer", color: "#DC3545" }}
                        onClick={() => openDeleteModal("card", card.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete this {itemToDelete?.type}?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
