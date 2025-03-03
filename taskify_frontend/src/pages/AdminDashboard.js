import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/");
        // Filter out admin users
        const nonAdminUsers = response.data.filter(
          (user) => user.role !== "admin"
        );
        setUsers(nonAdminUsers);
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

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(
        `http://localhost:8000/users/${userToDelete.username}/`
      );
      setUsers(users.filter((user) => user.username !== userToDelete.username));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="container min-vh-100 py-5">
      <div
        className="text-center mb-5"
        style={{
          padding: "10px",
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
            <p className="text-center text-muted">No non-admin users found.</p>
          ) : (
            <div
              className="card"
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                background: "linear-gradient(to bottom, #FFF8E7, #E8D3B9)",
                overflowY: "auto",
                // height: "500px",
              }}
            >
              <div className="card-body">
                <h4
                  className="card-title text-center"
                  style={{ color: "#4A2F1A" }}
                >
                  Users
                </h4>
                <ul className="list-group list-group-flush">
                  {users.map((user) => (
                    <li
                      key={user.username}
                      className="list-group-item d-flex justify-content-between align-items-center user-list"
                      style={{ background: "", border: "none" }}
                      onClick={() => handleUserClick(user.username)}
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
                            cursor: "pointer",
                          }}
                        >
                          {user.username}
                        </span>
                      </div>
                      <i
                        className="bi bi-trash"
                        style={{ cursor: "pointer", color: "#DC3545" }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering handleUserClick
                          handleDeleteClick(user);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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
                  onClick={cancelDelete}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete {userToDelete?.username}?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
