import React, { useState, useEffect, useCallback } from "react";
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
  const [taskTitle, setTaskTitle] = useState(task?.task_title || "");
  const [desc, setDesc] = useState(task?.desc || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.due_date || "");

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
              <input
                type="datetime-local"
                className="form-control rounded-pill shadow-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ borderColor: "#4A2F1A", backgroundColor: "#FFF8E7" }}
              />
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button
              className="btn btn-success btn-lg rounded-pill px-5 me-2"
              style={{ backgroundColor: "#4CAF50", borderColor: "#4A2F1A" }}
              onClick={() => {
                onSubmit({ taskTitle, desc, priority, dueDate, cardId });
                setTaskTitle("");
                setDesc("");
                setPriority("medium");
                setDueDate("");
                onClose();
              }}
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
            Are you sure you want to delete this task?
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

  // Fetch card data when editing
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
          }
        })
        .catch((error) => {
          console.error("Error fetching card data:", error);
        });
    }
  }, [cardId, showModal, boardId]); // Added boardId to dependencies

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
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button
              className="btn btn-success btn-lg rounded-pill px-5 me-2"
              style={{ backgroundColor: "#4CAF50", borderColor: "#4A2F1A" }}
              onClick={() => {
                onSubmit({ cardTitle, category });
                setCardTitle("");
                setCategory("todo");
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

  const fetchCards = useCallback(() => {
    if (username && boardId) {
      axios
        .get("http://localhost:8000/cards/", {
          params: { username, board_id: boardId },
        })
        .then((response) => {
          console.log("Fetched cards with tasks:", response.data); // Log to verify tasks
          setCards(response.data);
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
        .then((response) => {
          setBoardName(response.data.board_title);
        })
        .catch((error) => {
          console.error("Error fetching board name:", error);
          setBoardName("Unnamed Board");
        });
    }
  }, [username, boardId]);

  useEffect(() => {
    fetchCards();
    fetchBoardName();
    // Remove this block:
    // const handleClickOutside = (event) => {
    //   if (!event.target.closest(".task-item")) {
    //     setClickedTaskId(null);
    //   }
    // };
    // document.addEventListener("click", handleClickOutside);
    // return () => document.removeEventListener("click", handleClickOutside);
  }, [fetchCards, fetchBoardName]);

  const handleCardClick = () => setShowCardModal(true);

  const handleTaskClick = (cardId, task = null) => {
    setSelectedCardId(cardId);
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCardSubmit = ({ cardTitle, category }) => {
    const payload = {
      card_title: cardTitle || "New Card",
      board: boardId, // Changed from board_id to board to match serializer
      category,
      username,
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
            ? "Failed to update card! " +
                (error.response?.data?.error || "Check server logs.")
            : "Something went wrong while creating the card!"
        );
      });
  };

  const handleTaskSubmit = ({ taskTitle, desc, priority, dueDate, cardId }) => {
    const payload = {
      task_title: taskTitle || "New Task",
      desc,
      card_id: cardId,
      priority,
      due_date: dueDate || null,
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
            ? "Failed to update task! " +
                (error.response?.data?.error || "Check server logs.")
            : "Something went wrong while creating the task!"
        );
      });
  };

  const handleTaskInputSubmit = (cardId) => {
    const taskTitle = taskInput[cardId];
    if (!taskTitle) return;
    const payload = {
      task_title: taskTitle,
      card: cardId, // Changed from card_id to card to match serializer
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
        alert(
          "Something went wrong while creating the task! " +
            (error.response?.data?.error || "Check server logs.")
        );
      });
  };

  const handleTaskCheck = (taskId, checked) => {
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
        alert(
          "Failed to update task status! " +
            (error.response?.data?.error || "Check server logs.")
        );
      });
  };
  const handleTaskDelete = () => {
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
        alert(
          "Failed to delete task! " +
            (error.response?.data?.error || "Check server logs.")
        );
      });
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If there's no valid destination, return early
    if (!destination) {
      return;
    }

    // If the task is dropped in the same position, return early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCardId = parseInt(source.droppableId);
    const destCardId = parseInt(destination.droppableId);
    const taskId = parseInt(result.draggableId);

    // Optimistically update the local state
    setCards((prevCards) => {
      const updatedCards = prevCards.map((card) => ({
        ...card,
        tasks: [...card.tasks],
      }));

      // Find source and destination cards
      const sourceCard = updatedCards.find((card) => card.id === sourceCardId);
      const destCard = updatedCards.find((card) => card.id === destCardId);

      if (!sourceCard || !destCard) {
        return updatedCards;
      }

      // Move task from source to destination
      const [movedTask] = sourceCard.tasks.splice(source.index, 1);
      destCard.tasks.splice(destination.index, 0, movedTask);

      return updatedCards;
    });

    // Perform API update after local state change
    axios
      .patch(`http://localhost:8000/tasks/${taskId}/update/`, {
        card: destCardId,
      })
      .then((response) => {
        console.log("Task moved:", response.data);
        fetchCards(); // Refresh data to ensure sync with backend
      })
      .catch((error) => {
        console.error(
          "Error moving task:",
          error.response?.data || error.message
        );
        alert("Failed to move task! Reverting...");
        fetchCards(); // Revert to server state on failure
      });
  };

  const closeModal = () => {
    setShowCardModal(false);
    setShowTaskModal(false);
    setShowDeleteModal(false);
    setSelectedCardId(null);
    setSelectedTask(null);
  };

  const handleCardDelete = () => {
    axios
      .delete(`http://localhost:8000/cards/${selectedCardId}/`, {
        params: { username: localStorage.getItem("username") }, // Pass username for authentication
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
        alert(
          "Failed to delete card! " +
            (error.response?.data?.error || "Check server logs.")
        );
      });
  };
  return (
    <div className="container-fluid min-vh-100 py-2">
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
          style={{
            fontWeight: "bold",
            fontSize: "1.75rem",
          }}
        >
          {boardName || "Loading..."}
        </h2>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="d-flex flex-nowrap overflow-auto py-2 ps-2 pe-0 custom-scrollbar"
          style={{
            gap: "10px",
            background: "linear-gradient(90deg, #8B5A2B, #D4A373)",
            borderRadius: "4px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            scrollBehavior: "auto",
            height: "85vh",
            alignItems: "flex-start",
          }}
        >
          {cards.map((card) => (
            <Droppable droppableId={String(card.id)} key={card.id}>
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
                        style={{ fontSize: "14px", color: "#FFF8E7" }}
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
                                    checkbox.style.transform = "translateX(0)";
                                    editIcon.style.opacity = "1";
                                    editIcon.style.transform = "translateX(0)";
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
                                      handleTaskCheck(task.id, task.checked)
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
                        if (e.key === "Enter") {
                          handleTaskInputSubmit(card.id);
                        }
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
                        e.target.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.4)";
                      }}
                    />
                  </div>
                </div>
              )}
            </Droppable>
          ))}
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
          />
        </div>
      </DragDropContext>

      <CardModal
        showModal={showCardModal}
        onClose={closeModal}
        title={selectedCardId ? "Edit Card" : "Create Card"}
        onSubmit={handleCardSubmit}
        cardId={selectedCardId}
        setShowDeleteModal={setShowDeleteModal}
        setSelectedCardId={setSelectedCardId}
        boardId={boardId}
      />
      <TaskModal
        showModal={showTaskModal}
        onClose={closeModal}
        cardId={selectedCardId}
        task={selectedTask}
        onSubmit={handleTaskSubmit}
        setSelectedTask={setSelectedTask} // Pass setSelectedTask
        setShowDeleteModal={setShowDeleteModal} // Pass setShowDeleteModal
      />
      <DeleteConfirmModal
        showModal={showDeleteModal}
        onClose={closeModal}
        onConfirm={selectedCardId ? handleCardDelete : handleTaskDelete}
      />
    </div>
  );
};

export default Cards;
