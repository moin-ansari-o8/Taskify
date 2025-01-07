import React, { Component } from "react";

import { Link } from "react-router-dom"; // Import Link for routing
import "./NavBar.css";
import "./bootstrap-icons/font/bootstrap-icons.css";

export class NavBar extends Component {
  render() {
    return (
      <div>
        {/* Light coffee background color */}
        <div style={{ backgroundColor: "#D2B48C" }}>
          <nav className="navbar mx-3 navbar-expand-lg">
            <div className="container-fluid">
              {/* Navbar brand */}
              <a
                className="nav-text navbar-brand"
                href="#"
                style={{ fontWeight: "bold" }}
              >
                Taskify
              </a>
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
                    <Link className="nav-link" to="/homepage">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/features">
                      Features
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
                      borderTopRightRadius: "0",
                      borderBottomRightRadius: "0",
                    }}
                  />
                  <button
                    className="btn"
                    type="submit"
                    style={{
                      color: "#8B4513",
                      border: "2px solid",
                      borderColor: "#8B4513",
                      backgroundColor: "transparent",
                    }}
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </form>

                {/* Right-aligned links */}
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">
                      Register
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
