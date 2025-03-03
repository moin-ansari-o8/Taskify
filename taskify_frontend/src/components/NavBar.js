import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import NotificationBell from "./NotificationBell";

function NavBarWrapper() {
  const location = useLocation();
  return <NavBar currentRoute={location.pathname} />;
}

class NavBar extends Component {
  state = {
    searchQuery: "",
    searchResults: { boards: [], cards: [], tasks: [] },
    showResults: false,
    notifications: [],
    showNotifications: false,
    editTaskId: null,
    editDueDate: "",
    showEditModal: false,
  };

  getInitials = (username) => {
    if (!username) return "?";
    const nameParts = username.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (
      nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : "")
    ).toUpperCase();
  };

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ searchQuery: query, showResults: query.length > 0 });
    if (query.length > 0) {
      this.performSearch(query);
    } else {
      this.setState({
        searchResults: { boards: [], cards: [], tasks: [] },
        showResults: false,
      });
    }
  };

  fetchNotifications = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      const response = await axios.get("http://localhost:8000/notifications/", {
        params: { username },
      });
      this.setState({ notifications: response.data });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  handleNotificationToggle = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      showNotifications: !prevState.showNotifications,
    }));
  };

  handleDismissNotification = (notificationId) => {
    axios
      .patch(`http://localhost:8000/notifications/${notificationId}/`, {
        dismissed: true,
      })
      .then(() => {
        this.fetchNotifications();
      })
      .catch((error) => {
        console.error("Error dismissing notification:", error);
        alert("Failed to dismiss notification!");
      });
  };

  handleEditDueDate = (taskId, dueDate) => {
    this.setState({
      editTaskId: taskId,
      editDueDate: dueDate || "",
      showEditModal: true,
    });
  };

  handleDueDateChange = (e) => {
    this.setState({ editDueDate: e.target.value });
  };

  handleDueDateSubmit = (taskId) => {
    const { editDueDate } = this.state;
    axios
      .patch(`http://localhost:8000/tasks/${taskId}/update/`, {
        due_date: editDueDate || null,
      })
      .then(() => {
        this.setState({
          editTaskId: null,
          editDueDate: "",
          showEditModal: false,
        });
        this.fetchNotifications(); // Refresh notifications after update
      })
      .catch((error) => {
        console.error("Error updating due date:", error);
        alert("Failed to update due date!");
      });
  };

  closeEditModal = () => {
    this.setState({ showEditModal: false, editTaskId: null, editDueDate: "" });
  };

  handleOutsideClick = (e) => {
    if (
      !e.target.closest(".nav-srch") &&
      !e.target.closest(".search-results")
    ) {
      this.setState({
        searchQuery: "",
        showResults: false,
        searchResults: { boards: [], cards: [], tasks: [] },
      });
    }
    if (
      !e.target.closest(".notification-area") &&
      !e.target.closest(".notification-dropdown") &&
      !e.target.closest(".edit-modal") &&
      !e.target.closest(".dropdown-menu")
    ) {
      this.setState({ showNotifications: false });
    }
  };

  performSearch = async (query) => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      const boardsResponse = await axios.get("http://localhost:8000/boards/", {
        params: { username },
      });
      const boards = boardsResponse.data.filter((board) =>
        board.board_title.toLowerCase().includes(query.toLowerCase())
      );

      const cards = [];
      const tasks = [];
      for (const board of boardsResponse.data) {
        const cardsResponse = await axios.get("http://localhost:8000/cards/", {
          params: { username, board_id: board.id },
        });
        const matchedCards = cardsResponse.data.filter((card) =>
          card.card_title.toLowerCase().includes(query.toLowerCase())
        );
        cards.push(...matchedCards);

        cardsResponse.data.forEach((card) => {
          const matchedTasks = card.tasks.filter((task) =>
            task.task_title.toLowerCase().includes(query.toLowerCase())
          );
          tasks.push(
            ...matchedTasks.map((task) => ({
              ...task,
              board_id: card.board,
            }))
          );
        });
      }

      this.setState({ searchResults: { boards, cards, tasks } });
    } catch (error) {
      console.error("Error fetching search results:", error);
      this.setState({ searchResults: { boards: [], cards: [], tasks: [] } });
    }
  };

  componentDidMount() {
    document.addEventListener("click", this.handleOutsideClick);
    this.fetchNotifications();
    this.interval = setInterval(this.fetchNotifications, 1000); // Poll every 1 second
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
    clearInterval(this.interval);
  }

  render() {
    const { currentRoute } = this.props;
    const {
      searchQuery,
      searchResults,
      showResults,
      notifications,
      showNotifications,
      editTaskId,
      editDueDate,
      showEditModal,
    } = this.state;

    const isSignin = currentRoute === "/signin";
    const isSignup = currentRoute === "/signup";
    const isHome = currentRoute === "/homepage";

    const username = localStorage.getItem("username") || "";
    const initials = this.getInitials(username);
    const isLoggedIn = !!username;

    const hasBoards = searchResults.boards.length > 0;
    const hasCards = searchResults.cards.length > 0;
    const hasTasks = searchResults.tasks.length > 0;

    return (
      <div>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <Link
              className="nav-text mx-2 navbar-brand nav-logo"
              to="/dashboard"
            >
              Taskify
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/homepage">
                    Home
                  </Link>
                </li>
                {!isSignin && !isHome && !isSignup && (
                  <li className="nav-item">
                    <Link className="nav-link" to="#">
                      Starred ★
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About
                  </Link>
                </li>
              </ul>

              {!isSignin && !isHome && !isSignup && (
                <div className="nav-srch position-relative">
                  <form
                    className="d-flex mx-auto"
                    role="search"
                    style={{ width: "65%", maxWidth: "500px" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.performSearch(searchQuery);
                    }}
                  >
                    <input
                      className="form-control srchbox"
                      type="search"
                      placeholder="Search boards, cards, tasks..."
                      aria-label="Search"
                      value={searchQuery}
                      onChange={this.handleSearchChange}
                      style={{
                        borderTopLeftRadius: "3px",
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: "0",
                        borderBottomLeftRadius: "3px",
                        outline: "none",
                      }}
                    />
                  </form>
                  {showResults && (hasBoards || hasCards || hasTasks) && (
                    <div
                      className="dropdown-menu show"
                      style={{
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginLeft: "7rem",
                        width: "65%",
                        overflowY: "auto",
                        zIndex: 1000,
                        background: "rgba(255, 248, 231, 0.95)",
                        border: "1px solid #4A2F1A",
                        borderRadius: "5px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        padding: "5px",
                      }}
                    >
                      {hasBoards && (
                        <div className="position-relative">
                          <span
                            className="dropdown-item-text text-muted"
                            style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                          >
                            Boards
                          </span>
                          {searchResults.boards.map((board) => (
                            <Link
                              key={board.id}
                              to={`/cards?boardId=${board.id}`}
                              className="dropdown-item custom-dropdown-item ms-4"
                            >
                              {board.board_title}
                            </Link>
                          ))}
                        </div>
                      )}

                      {hasBoards && (hasCards || hasTasks) && (
                        <hr className="dropdown-divider" />
                      )}

                      {hasCards && (
                        <div className="position-relative">
                          <span
                            className="dropdown-item-text text-muted"
                            style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                          >
                            Cards
                          </span>
                          {searchResults.cards.map((card) => (
                            <Link
                              key={card.id}
                              to={`/cards?boardId=${card.board}`}
                              className="dropdown-item custom-dropdown-item ms-4"
                            >
                              {card.card_title}
                            </Link>
                          ))}
                        </div>
                      )}

                      {hasCards && hasTasks && (
                        <hr className="dropdown-divider" />
                      )}

                      {hasTasks && (
                        <div className="position-relative">
                          <span
                            className="dropdown-item-text text-muted"
                            style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                          >
                            Tasks
                          </span>
                          {searchResults.tasks.map((task) => (
                            <Link
                              key={task.id}
                              to={`/cards?boardId=${task.board_id}`}
                              className="dropdown-item custom-dropdown-item ms-4"
                            >
                              {task.task_title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {!isSignin && !isSignup && (
                  <>
                    <li className="nav-item notification-area position-relative">
                      <Link
                        className="nav-link"
                        to="#"
                        onClick={this.handleNotificationToggle}
                      >
                        Notification <NotificationBell />
                        {notifications.length > 0 && (
                          <span
                            className="badge rounded-pill"
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "5px",
                              width: "20px",
                              backgroundColor: "#4A2F1A",
                              color: "white",
                              borderRadius: "50%",
                              padding: "5px",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {notifications.length}
                          </span>
                        )}
                      </Link>
                      {showNotifications && (
                        <div
                          className="dropdown-menu show notification-dropdown my-2"
                          style={{
                            top: "100%",
                            right: 0,
                            width: "300px",
                            overflowY: "auto",
                            zIndex: 100,
                            background: "rgba(255, 248, 231, 0.95)",
                            // border: "1px solid #4A2F1A",
                            borderRadius: "5px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            padding: "5px",
                          }}
                        >
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className="position-relative d-flex align-items-center justify-content-between"
                                style={{ padding: "5px 10px", border: "none" }}
                              >
                                <i
                                  className="bi bi-pencil me-2 pencil"
                                  style={{
                                    cursor: "pointer",
                                    color: "rgb(204, 161, 3)",
                                  }}
                                  onClick={() =>
                                    this.handleEditDueDate(
                                      notification.task,
                                      notification.due_date
                                    )
                                  }
                                ></i>
                                <span
                                  className="dropdown-item-text"
                                  style={{
                                    flex: "1",
                                    fontSize: "1rem",

                                    color: "rgb(242, 215, 118)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {notification.title}
                                </span>
                                <i
                                  className="bi bi-x-circle ms-2"
                                  style={{
                                    cursor: "pointer",
                                    color: "#463223",
                                  }}
                                  onClick={() =>
                                    this.handleDismissNotification(
                                      notification.id
                                    )
                                  }
                                ></i>
                              </div>
                            ))
                          ) : (
                            <div
                              className="dropdown-item-text text-muted text-center"
                              style={{
                                padding: "5px 10px",
                                fontSize: "0.9rem",
                              }}
                            >
                              No notifications
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                    <li className="nav-item dropdown">
                      <button
                        className="btn nav-link "
                        type="button"
                        id="accountDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "#463223",
                          color: "#FFF8E7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          border: "none",
                          padding: "0",
                        }}
                      >
                        {initials}
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end my-2"
                        aria-labelledby="accountDropdown"
                      >
                        <li>
                          <span
                            className="dropdown-item-text text-muted"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Account
                          </span>
                        </li>
                        {isLoggedIn ? (
                          <>
                            <li>
                              <Link
                                className="dropdown-item custom-dropdown-item"
                                to="/profile"
                              >
                                Profile
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item custom-dropdown-item"
                                onClick={() => {
                                  localStorage.removeItem("username");
                                  window.location.href = "/signin";
                                }}
                              >
                                Logout
                              </button>
                            </li>
                          </>
                        ) : (
                          <>
                            <li>
                              <Link
                                className="dropdown-item custom-dropdown-item"
                                to="/signin"
                              >
                                Sign In
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item custom-dropdown-item"
                                to="/signup"
                              >
                                Sign Up
                              </Link>
                            </li>
                          </>
                        )}
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <span
                            className="dropdown-item-text text-muted"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Others
                          </span>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item custom-dropdown-item"
                            to="/activity"
                          >
                            Activity
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item custom-dropdown-item"
                            to="/help"
                          >
                            Help
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
                {isSignin && (
                  <li className="nav-item">
                    <Link className="nav-link outline" to="/signup">
                      Sign Up
                    </Link>
                  </li>
                )}
                {isSignup && (
                  <li className="nav-item">
                    <Link className="nav-link outline" to="/signin">
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {showEditModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                style={{
                  background: "rgba(255, 248, 231, 0.95)",
                  border: "1px solid #4A2F1A",
                  borderRadius: "5px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="modal-header border-0">
                  <h5
                    className="modal-title mx-auto"
                    style={{ color: "#4A2F1A" }}
                  >
                    Edit Due Date
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={this.closeEditModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="datetime-local"
                    value={editDueDate}
                    onChange={this.handleDueDateChange}
                    className="form-control"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="modal-footer border-0 justify-content-center">
                  <button
                    className="btn btn-success"
                    onClick={() => this.handleDueDateSubmit(editTaskId)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={this.closeEditModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default NavBarWrapper;
