import React, { Component } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
// import "./NavBar.css";
import "./bootstrap-icons/font/bootstrap-icons.css";
import NotificationBell from "./NotificationBell";

export class NavBar extends Component {
  render() {
    return (
      <div>
        {/* Light coffee background color */}
        <div>
          <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
              {/* Navbar brand */}
              <Link
                className="nav-text mx-2 navbar-brand"
                to="/homepage"
                style={{
                  fontWeight: "bold",
                  fontSize: "17px", // Adjusts the font size
                  fontFamily: "'Pacifico', cursive", // Cursive font
                  background: "linear-gradient(to right, #6B4F3B, #C8B19A)", // Adds a gradient background
                  color: "#fff", // Sets the text color to white for contrast
                  padding: "10px 20px", // Adds padding around the text
                  borderRadius: "5px", // Rounds the corners of the background
                  textTransform: "uppercase", // Makes the text uppercase
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Adds a subtle shadow for depth
                  transition: "transform 0.3s ease-in-out", // Adds smooth hover transition
                }}
                // onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")} // Adds a hover effect
                // onMouseLeave={(e) => (e.target.style.transform = "scale(1)")} // Resets hover effect
              >
                Taskify
              </Link>

              {/* Hamburger button for small screens */}
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
                {/* Left-aligned links */}
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      Starred &#9733;
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      About
                    </Link>
                  </li>
                </ul>
                {/* Centered search form */}
                <form
                  className="d-flex mx-auto"
                  role="search"
                  style={{
                    width: "50%",
                    maxWidth: "500px",
                  }}
                >
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    style={{
                      borderTopLeftRadius: "3px",
                      borderTopRightRadius: "0",
                      borderBottomRightRadius: "0",
                      borderBottomLeftRadius: "3px",
                    }}
                  />
                  <button className="btn srch" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </form>

                {/* Right-aligned links */}
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      Notification <NotificationBell />
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      Account
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link login-register" to="/signin">
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link login-register" to="/signup">
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default NavBar;
