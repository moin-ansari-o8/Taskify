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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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

  // New function to handle info button click
  const handleInfoClick = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowInfoModal(true);
  };

  // New function to close info modal
  const closeInfoModal = () => {
    setShowInfoModal(false);
    setSelectedItem(null);
  };

  // Function to format date to "12th Jan, 12:03"
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Add ordinal suffix (st, nd, rd, th)
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return `${day}${suffix} ${month}, ${hours}:${minutes}`;
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
                      className="list-group-item d-flex justify-content-between align-items-center user-edit-list"
                      style={{ background: "", border: "none" }}
                      onClick={() => handleBoardClick(board.id)}
                    >
                      <span style={{ color: "#4A2F1A", cursor: "pointer" }}>
                        {board.board_title}
                      </span>
                      <div>
                        <i
                          className="bi bi-info-circle me-2"
                          style={{ cursor: "pointer", color: "#4A2F1A" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInfoClick(board, "board");
                          }}
                        />
                        <i
                          className="bi bi-trash"
                          style={{ cursor: "pointer", color: "#DC3545" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal("board", board.id);
                          }}
                        />
                      </div>
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
                        className="list-group-item d-flex justify-content-between align-items-center user-edit-list"
                        style={{ background: "", border: "none" }}
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <span style={{ color: "#4A2F1A", cursor: "pointer" }}>
                          {task.task_title}
                        </span>
                        <div>
                          <i
                            className="bi bi-info-circle me-2"
                            style={{ cursor: "pointer", color: "#4A2F1A" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInfoClick(task, "task");
                            }}
                          />
                          <i
                            className="bi bi-trash"
                            style={{ cursor: "pointer", color: "#DC3545" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal("task", task.id);
                            }}
                          />
                        </div>
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
                      className="list-group-item d-flex justify-content-between align-items-center user-edit-list"
                      style={{ background: "", border: "none" }}
                      onClick={() => handleCardClick(card.id)}
                    >
                      <span style={{ color: "#4A2F1A", cursor: "pointer" }}>
                        {card.card_title}
                      </span>
                      <div>
                        <i
                          className="bi bi-info-circle me-2"
                          style={{ cursor: "pointer", color: "#4A2F1A" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInfoClick(card, "card");
                          }}
                        />
                        <i
                          className="bi bi-trash"
                          style={{ cursor: "pointer", color: "#DC3545" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal("card", card.id);
                          }}
                        />
                      </div>
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

      {/* Info Modal */}
      {showInfoModal && selectedItem && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedItem.type.charAt(0).toUpperCase() +
                    selectedItem.type.slice(1)}{" "}
                  Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeInfoModal}
                />
              </div>
              <div className="modal-body">
                {selectedItem.type === "board" && (
                  <>
                    <p>
                      <strong>ID:</strong> {selectedItem.id}
                    </p>
                    <p>
                      <strong>Title:</strong> {selectedItem.board_title}
                    </p>
                    <p>
                      <strong>User ID:</strong> {selectedItem.user}
                    </p>
                  </>
                )}
                {selectedItem.type === "card" && (
                  <>
                    <p>
                      <strong>ID:</strong> {selectedItem.id}
                    </p>
                    <p>
                      <strong>Title:</strong> {selectedItem.card_title}
                    </p>
                    <p>
                      <strong>Board ID:</strong> {selectedItem.board}
                    </p>
                    <p>
                      <strong>Category:</strong> {selectedItem.category}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {formatDate(selectedItem.created_date_time)}
                    </p>
                    <p>
                      <strong>Updated:</strong>{" "}
                      {formatDate(selectedItem.updated_date_time)}
                    </p>
                    <p>
                      <strong>Order:</strong> {selectedItem.order}
                    </p>
                  </>
                )}
                {selectedItem.type === "task" && (
                  <>
                    <p>
                      <strong>ID:</strong> {selectedItem.id}
                    </p>
                    <p>
                      <strong>Title:</strong> {selectedItem.task_title}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedItem.desc || "None"}
                    </p>
                    <p>
                      <strong>Card ID:</strong> {selectedItem.card}
                    </p>
                    <p>
                      <strong>Due Date:</strong>{" "}
                      {formatDate(selectedItem.due_date)}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {formatDate(selectedItem.created_at)}
                    </p>
                    <p>
                      <strong>Priority:</strong> {selectedItem.priority}
                    </p>
                    <p>
                      <strong>Checked:</strong>{" "}
                      {selectedItem.checked ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Order:</strong> {selectedItem.order}
                    </p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeInfoModal}
                >
                  Close
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
