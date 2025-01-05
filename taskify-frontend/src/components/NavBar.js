import React, { Component } from "react";
import "./NavBar.css";
import "./bootstrap-icons/font/bootstrap-icons.css";

export class NavBar extends Component {
  render() {
    return (
      <div>
        {/* Light coffee background color */}
        <div style={{ backgroundColor: "#D2B48C" }}>
          <nav className="navbar mx-3 navbar-expand-lg ">
            <div className="container-fluid">
              {/* Navbar brand */}
              <a
                className="nav-text navbar-brand"
                href="#"
                style={{ fontWeight: "bold" }} // Matching text color
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
                {/* Navigation links */}
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Features
                    </a>
                  </li>
                </ul>
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button
                    className="btn"
                    type="submit"
                    style={{
                      color: "#8B4513",
                      border: "2px solid",
                      borderColor: "#8B4513",
                    }}
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default NavBar;
