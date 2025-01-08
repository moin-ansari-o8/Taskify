import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation
import "./bootstrap-icons/font/bootstrap-icons.css";
import NotificationBell from "./NotificationBell";

// Wrapper to pass location to NavBar
function NavBarWrapper() {
  const location = useLocation();
  return <NavBar currentRoute={location.pathname} />;
}

class NavBar extends Component {
  render() {
    const { currentRoute } = this.props;

    // Check if the current route is "/dashboard"
    const isDashboard = currentRoute === "/dashboard";
    const isSignin = currentRoute === "/signin";
    const isSignup = currentRoute === "/signup";
    const isAbout = currentRoute === "/about";
    const isHome = currentRoute === "/homepage";

    return (
      <div>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            {/* Navbar brand */}
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
                {!isSignin && !isHome && !isSignup && (
                  <li className="nav-item">
                    <Link className="nav-link" to="#">
                      Starred &#9733;
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About
                  </Link>
                </li>
              </ul>

              {/* Centered search form */}
              {!isSignin && !isHome && !isSignup && (
                <div className="nav-srch">
                  <form
                    className="d-flex mx-auto"
                    role="search"
                    style={{
                      width: "65%",
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
                </div>
              )}
              {/* Right-aligned links */}
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {!isSignin && !isHome && !isSignup && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/about">
                        Notification <NotificationBell />
                      </Link>
                    </li>
                    <li className="nav-item outline">
                      <Link className="nav-link outline" to="/about">
                        Account
                      </Link>
                    </li>
                  </>
                )}
                {isHome && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link outline" to="/signin">
                        Sign In
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link outline" to="/signup">
                        Sign Up
                      </Link>
                    </li>
                  </>
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
