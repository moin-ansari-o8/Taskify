import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import "./bootstrap-icons/font/bootstrap-icons.css";
import NotificationBell from "./NotificationBell";
import axios from "axios";

function NavBarWrapper() {
  const location = useLocation();
  return <NavBar currentRoute={location.pathname} />;
}

class NavBar extends Component {
  state = {
    searchQuery: "",
    searchResults: { boards: [], cards: [], tasks: [] },
    showResults: false,
  };

  // Helper to get initials from username
  getInitials = (username) => {
    if (!username) return "?";
    const nameParts = username.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (
      nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : "")
    ).toUpperCase();
  };

  // Handle search input change
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

  // Perform search across boards, cards, and tasks
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

  // Close dropdown on outside click
  handleOutsideClick = (e) => {
    if (
      !e.target.closest(".nav-srch") &&
      !e.target.closest(".search-results")
    ) {
      this.setState({ showResults: false });
    }
  };

  componentDidMount() {
    document.addEventListener("click", this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  }

  render() {
    const { currentRoute } = this.props;
    const { searchQuery, searchResults, showResults } = this.state;

    const isDashboard = currentRoute === "/dashboard";
    const isSignin = currentRoute === "/signin";
    const isSignup = currentRoute === "/signup";
    const isAbout = currentRoute === "/about";
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
              className="nav-text mx-2 navbar-brand"
              to="/dashboard"
              style={{
                fontWeight: "bold",
                fontSize: "17px",
                fontFamily: "'Pacifico', cursive",
                background: "linear-gradient(to right, #6B4F3B, #C8B19A)",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                textTransform: "uppercase",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                transition: "transform 0.3s ease-in-out",
              }}
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
                      this.performSearch(searchQuery); // Trigger search on form submit (icon click)
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
                        // border: "1px solid #4A2F1A", // Default brown border
                        outline: "none", // Remove blue outline
                      }}
                    />
                    <button className="btn srch" type="submit">
                      <i className="bi bi-search"></i>
                    </button>
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
                        maxHeight: "300px",
                        overflowY: "auto",
                        zIndex: 1000,
                        background: "rgba(255, 248, 231, 0.95)",
                        border: "1px solid #4A2F1A",
                        borderRadius: "5px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        padding: "5px 0",
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
                              className="dropdown-item custom-dropdown-item"
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
                              className="dropdown-item custom-dropdown-item"
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
                              className="dropdown-item custom-dropdown-item"
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
                    <li className="nav-item">
                      <Link className="nav-link" to="/about">
                        Notification <NotificationBell />
                      </Link>
                    </li>
                    <li className="nav-item dropdown">
                      <button
                        className="btn nav-link"
                        type="button"
                        id="accountDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "#8C4F30",
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
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="accountDropdown"
                        style={{
                          background: "rgba(255, 248, 231, 0.95)",
                          border: "1px solid #4A2F1A",
                          borderRadius: "5px",
                        }}
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
      </div>
    );
  }
}

export default NavBarWrapper;
