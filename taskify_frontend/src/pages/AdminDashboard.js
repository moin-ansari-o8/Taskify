import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load users. Please try again.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (username) => {
    navigate(`/admin-dashboard/edit-user/${username}`);
  };

  return (
    <div className="container min-vh-100 py-5">
      <div
        className="text-center mb-5"
        style={{
          padding: "15px",
          background: "linear-gradient(135deg, #8C4F30, #5B3A29)",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          className="display-5 text-white"
          style={{ fontWeight: "bold", letterSpacing: "1px" }}
        >
          Admin Dashboard
        </h1>
        <p className="lead text-light" style={{ opacity: "0.9" }}>
          Manage all users and their tasks with ease
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-muted" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted">No users found.</p>
          ) : (
            <div
              className="list-group"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              {users.map((user) => (
                <button
                  key={user.username}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleUserClick(user.username)}
                  style={{
                    background: "linear-gradient(to right, #FFF8E7, #F5E8D5)",
                    border: "none",
                    padding: "20px",
                    marginBottom: "2px",
                    transition: "transform 0.2s, background 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background =
                      "linear-gradient(to right, #F5E8D5, #E8D3B9)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background =
                      "linear-gradient(to right, #FFF8E7, #F5E8D5)")
                  }
                  onMouseDown={(e) =>
                    (e.target.style.transform = "scale(0.98)")
                  }
                  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#8C4F30",
                        color: "#FFF8E7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontSize: "1.25rem",
                        color: "#4A2F1A",
                        fontWeight: "500",
                      }}
                    >
                      {user.username}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
