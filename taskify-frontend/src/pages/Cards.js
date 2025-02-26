import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from "../components/Card";

const TaskModal = ({
  showModal,
  onClose,
  cardId,
  onSubmit,
  task = null,
  setSelectedTask,
  setShowDeleteModal,
}) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(""); // ISO format for datetime-local
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper function to format ISO date to dd-mm-yy HH:MM for display (if needed)
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // Helper to convert ISO to datetime-local compatible format (YYYY-MM-DDTHH:MM)
  const formatForDateTimeLocal = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Fetch task data when editing
  useEffect(() => {
    if (task && showModal) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/tasks/${task.id}/`)
        .then((response) => {
          const taskData = response.data;
          setTaskTitle(taskData.task_title || "");
          setDesc(taskData.desc || "");
          setPriority(taskData.priority || "medium");
          setDueDate(formatForDateTimeLocal(taskData.due_date)); // For datetime-local
          setOrder(taskData.order || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching task data:", err);
          setError("Failed to load task data.");
          setLoading(false);
        });
    } else {
      setTaskTitle("");
      setDesc("");
      setPriority("medium");
      setDueDate("");
      setOrder(0);
      setError("");
    }
  }, [task, showModal]);

  if (!showModal) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg rounded-3"
          style={{
            background: "linear-gradient(135deg, #8B5A2B, #D4A373)",
            border: "2px solid #4A2F1A",
          }}
        >
          <div className="modal-header border-0">
            <h5
              className="modal-title mx-auto fw-bold"
              style={{
                color: "#FFF8E7",
                fontSize: "1.8rem",
                fontFamily: "'Pacifico', cursive",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              {task ? "Edit Task" : "Add Task"}
            </h5>
            <button
              type="button"
              className="btn-close position-absolute end-0 me-3"
              style={{ filter: "brightness(150%)" }}
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-4">
            {loading && <p style={{ color: "#FFF8E7" }}>Loading...</p>}
            {error && <p style={{ color: "#D9534F" }}>{error}</p>}
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                style={{ color: "#FFF8E7" }}
              >
                Task Title
              </label>
              <input
                type="text"
                className="form-control rounded-pill shadow-sm"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task name"
                style={{ borderColor: "#4A2F1A", backgroundColor: "#FFF8E7" }}
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                style={{ color: "#FFF8E7" }}
              >
                Description
              </label>
              <textarea
                className="form-control rounded-3 shadow-sm"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Enter task description"
                rows="3"
                style={{ borderColor: "#4A2F1A", backgroundColor: "#FFF8E7" }}
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                style={{ color: "#FFF8E7" }}
              >
                Priority
              </label>
              <div className="d-flex flex-column gap-2">
                {["high", "medium", "low"].map((prio) => (
                  <div key={prio} className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id={prio}
                      name="priority"
                      value={prio}
                      checked={priority === prio}
                      onChange={(e) => setPriority(e.target.value)}
                      style={{ borderColor: "#4A2F1A" }}
                      disabled={loading}
                    />
                    <label
                      className="form-check-label"
                      style={{ color: "#FFF8E7" }}
                      htmlFor={prio}
                    >
                      {prio.charAt(0).toUpperCase() + prio.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                style={{ color: "#FFF8E7" }}
              >
                Due Date
              </label>
              <div className="d-flex align-items-center">
                <input
                  type="datetime-local"
                  className="form-control rounded-pill shadow-sm"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    borderColor: "#4A2F1A",
                    backgroundColor: "#FFF8E7",
                    flex: "1",
                  }}
                  disabled={loading}
                />
                {/* Optional: Display formatted date beside it
                <span className="ms-2" style={{ color: "#FFF8E7" }}>
                  {dueDate ? formatDateForDisplay(dueDate) : ""}
                </span> */}
              </div>
            </div>
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                style={{ color: "#FFF8E7" }}
              >
                Order
              </label>
              <input
                type="number"
                className="form-control rounded-pill shadow-sm"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                style={{ borderColor: "#4A2F1A", backgroundColor: "#FFF8E7" }}
                disabled={loading}
              />
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button
              className="btn btn-success btn-lg rounded-pill px-5 me-2"
              style={{ backgroundColor: "#4CAF50", borderColor: "#4A2F1A" }}
              onClick={() => {
                const isoDueDate = dueDate || null; // Already in ISO format from datetime-local
                onSubmit({
                  taskTitle,
                  desc,
                  priority,
                  dueDate: isoDueDate,
                  cardId,
                  order,
                });
                setTaskTitle("");
                setDesc("");
                setPriority("medium");
                setDueDate("");
                setOrder(0);
                onClose();
              }}
              disabled={loading}
            >
              Submit
            </button>
            {task && (
              <button
                className="btn btn-danger btn-lg rounded-pill px-4"
                style={{ backgroundColor: "#D9534F", borderColor: "#4A2F1A" }}
                onClick={() => {
                  setSelectedTask(task);
                  setShowDeleteModal(true);
                }}
                disabled={loading}
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
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
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg rounded-3"
          style={{
            background: "linear-gradient(135deg, #8B5A2B, #D4A373)",
            border: "2px solid #4A2F1A",
          }}
        >
          <div className="modal-header border-0">
            <h5
              className="modal-title mx-auto fw-bold"
              style={{
                color: "#FFF8E7",
                fontSize: "1.8rem",
                fontFamily: "'Pacifico', cursive",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              Confirm Deletion
            </h5>
            <button
              type="button"
              className="btn-close position-absolute end-0 me-3"
              style={{ filter: "brightness(150%)" }}
              onClick={onClose}
            ></button>
          </div>
          <div
            className="modal-body p-4 text-center"
            style={{ color: "#FFF8E7" }}
          >
            Are you sure you want to delete this?
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button
              className="btn btn-danger btn-lg rounded-pill px-4 mx-2"
              style={{ backgroundColor: "#D9534F", borderColor: "#4A2F1A" }}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-secondary btn-lg rounded-pill px-4 mx-2"
              style={{ backgroundColor: "#6C757D", borderColor: "#4A2F1A" }}
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

const CardModal = ({
  showModal,
  onClose,
  title,
  onSubmit,
  cardId,
  setShowDeleteModal,
  setSelectedCardId,
  boardId,
}) => {
  const [cardTitle, setCardTitle] = useState("");
  const [category, setCategory] = useState("todo");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (cardId && showModal) {
      axios
        .get(`http://localhost:8000/cards/`, {
          params: {
            username: localStorage.getItem("username"),
            board_id: boardId,
            card_id: cardId,
          },
        })
        .then((response) => {
          const cardData = response.data.find((c) => c.id === cardId);
          if (cardData) {
            setCardTitle(cardData.card_title);
            setCategory(cardData.category);
            setOrder(cardData.order || 0);
          }
        })
        .catch((error) => console.error("Error fetching card data:", error));
    }
  }, [cardId, showModal, boardId]);

  if (!showModal) return null;

  const handleDelete = () => {
    setSelectedCardId(cardId);
    setShowDeleteModal(true);
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg rounded-3"
          style={{
            background: "linear-gradient(135deg, #8B5A2B, #D4A373)",
            border: "2px solid #4A2F1A",
          }}
        >
          <div className="modal-header border-0">
            <h5
              className="modal-title mx-auto fw-bold"
              style={{
                color: "#FFF8E7",
                fontSize: "1.8rem",
                fontFamily: "'Pacifico', cursive",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              {title}
            </h5>
            <button
              type="button"
              className="btn-close position-absolute end-0 me-3"
              style={{ filter: "brightness(150%)" }}
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                style={{ color: "#FFF8E7" }}
              >
                Card Title
              </label>
              <input
                type="text"
                className="form-control form-control-lg rounded-pill shadow-sm"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Enter card name"
                style={{ borderColor: "#4A2F1A", backgroundColor: "#FFF8E7" }}
              />
            </div>
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                style={{ color: "#FFF8E7" }}
              >
                Category
              </label>
              <div className="d-flex flex-column gap-2">
                {["todo", "schedule", "project"].map((cat) => (
                  <div key={cat} className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id={cat}
                      name="category"
                      value={cat}
                      checked={category === cat}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ borderColor: "#4A2F1A" }}
                    />
                    <label
                      className="form-check-label"
                      style={{ color: "#FFF8E7" }}
                      htmlFor={cat}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                style={{ color: "#FFF8E7" }}
              >
                Order
              </label>
              <input
                type="number"
                className="form-control rounded-pill shadow-sm"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                style={{ borderColor: "#4A2F1A", backgroundColor: "#FFF8E7" }}
              />
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button
              className="btn btn-success btn-lg rounded-pill px-5 me-2"
              style={{ backgroundColor: "#4CAF50", borderColor: "#4A2F1A" }}
              onClick={() => {
                onSubmit({ cardTitle, category, order });
                setCardTitle("");
                setCategory("todo");
                setOrder(0);
                onClose();
              }}
            >
              Submit
            </button>
            {cardId && (
              <button
                className="btn btn-danger btn-lg rounded-pill px-4"
                style={{ backgroundColor: "#D9534F", borderColor: "#4A2F1A" }}
                onClick={handleDelete}
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

class DragDropErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    if (
      error.message?.includes(
        "Cannot finish a drop animating when no drop is occurring"
      )
    ) {
      return { hasError: true };
    }
    throw error;
  }
  render() {
    if (this.state.hasError) {
      console.log("Suppressed react-beautiful-dnd animation error.");
      return this.props.children;
    }
    return this.props.children;
  }
}

const Cards = () => {
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId");
  const username = localStorage.getItem("username");
  const [cards, setCards] = useState([]);
  const [boardName, setBoardName] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskInput, setTaskInput] = useState({});
  const [deleteType, setDeleteType] = useState(null);
  const [clickedTaskId, setClickedTaskId] = useState(null);
  const isDragging = useRef(false);
  const addCardRef = useRef(null);

  const fetchCards = useCallback(() => {
    if (username && boardId && !isDragging.current) {
      axios
        .get("http://localhost:8000/cards/", {
          params: { username, board_id: boardId },
        })
        .then((response) => {
          console.log("Fetched cards with tasks:", response.data);
          const sortedCards = response.data
            .sort((a, b) => a.order - b.order)
            .map((card) => ({
              ...card,
              tasks: card.tasks.sort((a, b) => a.order - b.order),
            }));
          setCards(sortedCards);
        })
        .catch((error) => {
          console.error("Error fetching cards:", error);
          alert(`Error fetching cards: ${error.message}`);
        });
    }
  }, [username, boardId]);

  const fetchBoardName = useCallback(() => {
    if (username && boardId) {
      axios
        .get(`http://localhost:8000/boards/${boardId}/`, {
          params: { username },
        })
        .then((response) => setBoardName(response.data.board_title))
        .catch((error) => {
          console.error("Error fetching board name:", error);
          setBoardName("Unnamed Board");
        });
    }
  }, [username, boardId]);

  const handleCardClick = useCallback(() => setShowCardModal(true), []);

  const handleTaskClick = useCallback((cardId, task = null) => {
    setSelectedCardId(cardId);
    setSelectedTask(task);
    setShowTaskModal(true);
  }, []);

  const handleCardSubmit = useCallback(
    ({ cardTitle, category, order }) => {
      const payload = {
        card_title: cardTitle || "New Card",
        board: boardId,
        category,
        username,
        order,
      };
      const request = selectedCardId
        ? axios.patch(`http://localhost:8000/cards/${selectedCardId}/`, payload)
        : axios.post("http://localhost:8000/cards/", payload);
      request
        .then((response) => {
          console.log(
            selectedCardId ? "Card updated:" : "Card created:",
            response.data
          );
          fetchCards();
        })
        .catch((error) => {
          console.error("Error:", error.response?.data || error.message);
          alert(
            selectedCardId
              ? "Failed to update card!"
              : "Something went wrong while creating the card!"
          );
        });
    },
    [selectedCardId, boardId, username, fetchCards]
  );

  const handleTaskSubmit = useCallback(
    ({ taskTitle, desc, priority, dueDate, cardId, order }) => {
      const payload = {
        task_title: taskTitle || "New Task",
        desc,
        card_id: cardId,
        priority,
        due_date: dueDate || null,
        order,
      };
      const request = selectedTask
        ? axios.patch(
            `http://localhost:8000/tasks/${selectedTask.id}/update/`,
            payload
          )
        : axios.post("http://localhost:8000/tasks/", payload);
      request
        .then((response) => {
          console.log(
            selectedTask ? "Task updated:" : "Task created:",
            response.data
          );
          fetchCards();
        })
        .catch((error) => {
          console.error("Error:", error.response?.data || error.message);
          alert(
            selectedTask
              ? "Failed to update task!"
              : "Something went wrong while creating the task!"
          );
        });
    },
    [selectedTask, fetchCards]
  );

  const handleTaskInputSubmit = useCallback(
    (cardId) => {
      const taskTitle = taskInput[cardId];
      if (!taskTitle) return;
      const payload = {
        task_title: taskTitle,
        card: cardId,
        order: cards.find((c) => c.id === cardId).tasks.length,
      };
      axios
        .post("http://localhost:8000/tasks/", payload)
        .then((response) => {
          console.log("Task created:", response.data);
          setTaskInput((prev) => ({ ...prev, [cardId]: "" }));
          fetchCards();
        })
        .catch((error) => {
          console.error(
            "Error creating task:",
            error.response?.data || error.message
          );
          alert("Something went wrong while creating the task!");
        });
    },
    [cards, taskInput, fetchCards]
  );

  const handleTaskCheck = useCallback(
    (taskId, checked) => {
      axios
        .patch(`http://localhost:8000/tasks/${taskId}/update/`, {
          checked: !checked,
        })
        .then((response) => {
          console.log("Task checked:", response.data);
          fetchCards();
        })
        .catch((error) => {
          console.error(
            "Error updating task:",
            error.response?.data || error.message
          );
          alert("Failed to update task status!");
        });
    },
    [fetchCards]
  );

  const handleTaskDelete = useCallback(() => {
    axios
      .delete(`http://localhost:8000/tasks/${selectedTask.id}/`)
      .then(() => {
        console.log("Task deleted successfully:", selectedTask.id);
        fetchCards();
      })
      .catch((error) => {
        console.error(
          "Error deleting task:",
          error.response?.data || error.message
        );
        alert("Failed to delete task!");
      });
  }, [selectedTask, fetchCards]);

  const handleCardDelete = useCallback(() => {
    axios
      .delete(`http://localhost:8000/cards/${selectedCardId}/`, {
        params: { username },
      })
      .then(() => {
        console.log("Card deleted successfully:", selectedCardId);
        fetchCards();
      })
      .catch((error) => {
        console.error(
          "Error deleting card:",
          error.response?.data || error.message
        );
        alert("Failed to delete card!");
      });
  }, [selectedCardId, username, fetchCards]);

  const handleAddCardMouseEnter = useCallback(() => {
    if (addCardRef.current) {
      addCardRef.current.style.borderColor = "#4CAF50";
      addCardRef.current.style.transition = "0.3s";
      addCardRef.current.style.boxShadow = "0 0 10px rgba(133, 59, 25, 0.91)";
    }
  }, []);

  const handleAddCardMouseLeave = useCallback(() => {
    if (addCardRef.current) {
      addCardRef.current.style.borderColor = "#4A2F1A";
      addCardRef.current.style.transition = "0.3s";
      addCardRef.current.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.4)";
    }
  }, []);

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId, type } = result;
      isDragging.current = false;

      if (!destination) {
        console.log("Dropped outside a droppable area, ignoring.");
        return;
      }

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        console.log("No position change, ignoring.");
        return;
      }

      if (type === "CARD") {
        const newCards = Array.from(cards);
        const [movedCard] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, movedCard);
        const updatedCards = newCards.map((card, index) => ({
          ...card,
          order: index,
        }));
        setCards(updatedCards);
        Promise.all(
          updatedCards.map((card) =>
            axios.patch(`http://localhost:8000/cards/${card.id}/`, {
              order: card.order,
              username,
            })
          )
        )
          .then(() => fetchCards())
          .catch((error) => {
            console.error("Error updating card order:", error);
            alert("Failed to update card order! Reverting...");
            fetchCards();
          });
      } else {
        const sourceCardId = parseInt(source.droppableId);
        const destCardId = parseInt(destination.droppableId);
        const taskId = parseInt(draggableId);

        const newCards = cards.map((card) => ({
          ...card,
          tasks: [...card.tasks],
        }));

        if (sourceCardId === destCardId) {
          const card = newCards.find((c) => c.id === sourceCardId);
          const [movedTask] = card.tasks.splice(source.index, 1);
          card.tasks.splice(destination.index, 0, movedTask);
          card.tasks = card.tasks.map((task, index) => ({
            ...task,
            order: index,
          }));
        } else {
          const sourceCard = newCards.find((c) => c.id === sourceCardId);
          const destCard = newCards.find((c) => c.id === destCardId);
          const [movedTask] = sourceCard.tasks.splice(source.index, 1);
          destCard.tasks.splice(destination.index, 0, movedTask);
          sourceCard.tasks = sourceCard.tasks.map((task, index) => ({
            ...task,
            order: index,
          }));
          destCard.tasks = destCard.tasks.map((task, index) => ({
            ...task,
            order: index,
          }));
          movedTask.card = destCardId;
        }

        setCards(newCards);

        const updates = [];
        newCards.forEach((card) => {
          card.tasks.forEach((task) => {
            updates.push(
              axios.patch(`http://localhost:8000/tasks/${task.id}/update/`, {
                card: card.id,
                order: task.order,
              })
            );
          });
        });
        Promise.all(updates)
          .then(() => fetchCards())
          .catch((error) => {
            console.error("Error updating task order:", error);
            alert("Failed to update task order! Reverting...");
            fetchCards();
          });
      }
    },
    [cards, username, fetchCards]
  );

  const closeModal = useCallback(() => {
    setShowCardModal(false);
    setShowTaskModal(false);
    setShowDeleteModal(false);
    setSelectedCardId(null);
    setSelectedTask(null);
    handleAddCardMouseLeave();
  }, [handleAddCardMouseLeave]);

  useEffect(() => {
    fetchCards();
    fetchBoardName();
    const handleClickOutside = (event) => {
      if (!event.target.closest(".task-item")) {
        setClickedTaskId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [fetchCards, fetchBoardName]);

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ paddingTop: "0.5rem" }}
    >
      <div
        className="text-start justify-content-center d-flex"
        style={{
          padding: "10px",
          marginTop: "2.5rem",
          marginBottom: "0.5rem",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          className="lead text-muted"
          style={{ fontWeight: "bold", fontSize: "1.75rem" }}
        >
          {boardName || "Loading..."}
        </h2>
      </div>
      <DragDropErrorBoundary>
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="board" direction="horizontal" type="CARD">
            {(provided) => (
              <div
                className="d-flex flex-nowrap overflow-auto py-2 ps-2 pe-0 custom-scrollbar"
                style={{
                  gap: "10px",
                  background: "linear-gradient(90deg, #8B5A2B, #D4A373)",
                  borderRadius: "4px",
                  minHeight: "calc(100vh - 135px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  scrollBehavior: "auto",
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {cards.map((card, index) => (
                  <Draggable
                    key={card.id}
                    draggableId={String(card.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Droppable droppableId={String(card.id)} type="TASK">
                          {(provided) => (
                            <div
                              className="card text-dark rounded-1 p-0"
                              style={{
                                minWidth: "250px",
                                maxWidth: "250px",
                                flexShrink: 0,
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                                border: "none",
                                background: "rgba(255, 248, 231, 0.8)",
                              }}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              <div className="d-flex align-items-center justify-content-between p-2">
                                <h5
                                  className="card-title text-center fw-bold mb-0 flex-grow-1"
                                  style={{ color: "#4A2F1A" }}
                                >
                                  {card.card_title} ({card.category})
                                </h5>
                                <button
                                  className="btn btn-sm btn-info ms-2"
                                  onClick={() => {
                                    setSelectedCardId(card.id);
                                    setShowCardModal(true);
                                  }}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    padding: 0,
                                    background: "#4A2F1A",
                                    border: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <i
                                    className="bi bi-pencil"
                                    style={{
                                      fontSize: "14px",
                                      color: "#FFF8E7",
                                    }}
                                  ></i>
                                </button>
                              </div>
                              <div className="card-body">
                                {card.tasks && card.tasks.length > 0 ? (
                                  <ul
                                    className="list-group mb-2 custom-scrollbar"
                                    style={{
                                      width: "100%",
                                      overflowY: "auto",
                                      overflowX: "hidden",
                                      padding: "4px 10px",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    {card.tasks.map((task, index) => (
                                      <Draggable
                                        key={task.id}
                                        draggableId={String(task.id)}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <li
                                            className="tsk-itm my-1 rounded-1"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <div
                                              className="d-flex align-items-center w-100"
                                              style={{
                                                position: "relative",
                                                padding: "0 8px",
                                                boxSizing: "border-box",
                                              }}
                                              onMouseEnter={(e) => {
                                                const checkbox =
                                                  e.currentTarget.querySelector(
                                                    ".task-checkbox"
                                                  );
                                                const editIcon =
                                                  e.currentTarget.querySelector(
                                                    ".task-edit"
                                                  );
                                                checkbox.style.opacity = "1";
                                                checkbox.style.transform =
                                                  "translateX(0)";
                                                editIcon.style.opacity = "1";
                                                editIcon.style.transform =
                                                  "translateX(0)";
                                              }}
                                              onMouseLeave={(e) => {
                                                const checkbox =
                                                  e.currentTarget.querySelector(
                                                    ".task-checkbox"
                                                  );
                                                const editIcon =
                                                  e.currentTarget.querySelector(
                                                    ".task-edit"
                                                  );
                                                checkbox.style.opacity = "0";
                                                checkbox.style.transform =
                                                  "translateX(-3px)";
                                                editIcon.style.opacity = "0";
                                                editIcon.style.transform =
                                                  "translateX(3px)";
                                              }}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={task.checked}
                                                onChange={() =>
                                                  handleTaskCheck(
                                                    task.id,
                                                    task.checked
                                                  )
                                                }
                                                className="task-checkbox my-2"
                                                style={{
                                                  opacity: 0,
                                                  width: "20px",
                                                  height: "20px",
                                                  margin: "0 8px 0 0",
                                                  transform: "translateX(-3px)",
                                                  transition:
                                                    "opacity 0.3s ease, transform 0.3s ease",
                                                  position: "relative",
                                                  zIndex: 3,
                                                  background: "#4A2F1A",
                                                  border: "none",
                                                }}
                                              />
                                              <span
                                                className="task-title"
                                                style={{
                                                  flex: "1",
                                                  textAlign: "center",
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  padding: "0 8px",
                                                }}
                                              >
                                                {task.task_title}
                                              </span>
                                              <button
                                                className="task-edit btn btn-sm btn-info mx-1"
                                                onClick={() =>
                                                  handleTaskClick(card.id, task)
                                                }
                                                style={{
                                                  opacity: 0,
                                                  width: "20px",
                                                  height: "20px",
                                                  transform: "translateX(3px)",
                                                  transition:
                                                    "opacity 0.3s ease, transform 0.3s ease",
                                                  position: "relative",
                                                  zIndex: 3,
                                                  padding: 0,
                                                  background: "#4A2F1A",
                                                  border: "none",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                <i
                                                  className="bi bi-pencil"
                                                  style={{ fontSize: "14px" }}
                                                ></i>
                                              </button>
                                            </div>
                                          </li>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </ul>
                                ) : (
                                  <p className="text-muted text-center mb-3">
                                    No tasks yet
                                  </p>
                                )}
                                <input
                                  type="text"
                                  className="form-control rounded-1"
                                  value={taskInput[card.id] || ""}
                                  onChange={(e) =>
                                    setTaskInput({
                                      ...taskInput,
                                      [card.id]: e.target.value,
                                    })
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter")
                                      handleTaskInputSubmit(card.id);
                                  }}
                                  placeholder="+ Add Task"
                                  style={{
                                    border: "none",
                                    backgroundColor: "#FFF8E7",
                                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.4)",
                                    color: "#4A2F1A",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.borderColor = "#4CAF50";
                                    e.target.style.transition = "0.3s";
                                    e.target.style.boxShadow =
                                      "0 0 10px rgba(133, 59, 25, 0.91)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.borderColor = "#4A2F1A";
                                    e.target.style.transition = "0.3s";
                                    e.target.style.boxShadow =
                                      "0 0 5px rgba(0, 0, 0, 0.4)";
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                <Draggable
                  draggableId="add-card"
                  index={cards.length}
                  isDragDisabled={true}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        title="Add Card"
                        onClick={handleCardClick}
                        showCircle="1"
                        className="text-dark border border-secondary rounded-3 shadow-sm"
                        style={{
                          background: "rgba(255, 248, 231, 0.8)",
                          borderColor: "#4A2F1A",
                          minWidth: "250px",
                          borderRadius: "4px",
                          marginRight: "8px",
                        }}
                        onMouseEnter={handleAddCardMouseEnter}
                        onMouseLeave={handleAddCardMouseLeave}
                        ref={addCardRef}
                      />
                    </div>
                  )}
                </Draggable>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </DragDropErrorBoundary>
      <CardModal
        showModal={showCardModal}
        onClose={closeModal}
        title={selectedCardId ? "Edit Card" : "Create Card"}
        onSubmit={handleCardSubmit}
        cardId={selectedCardId}
        setShowDeleteModal={(value) => {
          setShowDeleteModal(value);
          if (value) setDeleteType("card");
        }}
        setSelectedCardId={setSelectedCardId}
        boardId={boardId}
      />
      <TaskModal
        showModal={showTaskModal}
        onClose={closeModal}
        cardId={selectedCardId}
        task={selectedTask}
        onSubmit={handleTaskSubmit}
        setSelectedTask={setSelectedTask}
        setShowDeleteModal={(value) => {
          setShowDeleteModal(value);
          if (value) setDeleteType("task");
        }}
      />
      <DeleteConfirmModal
        showModal={showDeleteModal}
        onClose={closeModal}
        onConfirm={deleteType === "card" ? handleCardDelete : handleTaskDelete}
      />
    </div>
  );
};

export default Cards;
