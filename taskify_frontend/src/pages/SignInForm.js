import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // For error messages
  const navigate = useNavigate(); // For redirecting after sign-in

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:8000/signin/", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        // Successful sign-in
        localStorage.setItem("username", formData.username); // Store username
        if (formData.rememberMe) {
          // Optionally store more persistent data if "Remember Me" is checked
          localStorage.setItem("rememberMe", "true");
        }
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      // Handle errors from backend
      if (err.response) {
        setError(
          err.response.data.error || "Sign-in failed. Please try again."
        );
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  const handleClear = () => {
    setFormData({
      username: "",
      password: "",
      rememberMe: false,
    });
    setShowPassword(false);
    setError("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4"
        style={{
          width: "500px",
          background:
            "linear-gradient(to bottom, rgba(107, 79, 59, 0.33), rgb(153, 131, 109))",
          borderRadius: "10px",
          border: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3
          className="card-title text-center"
          style={{ fontSize: "30px", color: "#4A2F1A" }}
        >
          Sign In
        </h3>
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-3">
            <label
              htmlFor="username"
              className="form-label"
              style={{ color: "#FFF8E7" }}
            >
              Username
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              style={{ borderColor: "#4A2F1A", backgroundColor: "#FFF8E7" }}
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label"
              style={{ color: "#FFF8E7" }}
            >
              Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded-pill"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{ borderColor: "#4A2F1A", backgroundColor: "#FFF8E7" }}
              />
              <div className="form-check ms-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPassword"
                  onChange={togglePasswordVisibility}
                  checked={showPassword}
                  style={{ borderColor: "#4A2F1A" }}
                />
              </div>
            </div>
          </div>

          {/* Remember Me Switch */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              style={{ borderColor: "#4A2F1A" }}
            />
            <label
              className="form-check-label"
              htmlFor="rememberMe"
              style={{ color: "#FFF8E7" }}
            >
              Remember me
            </label>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-success rounded-pill"
              style={{
                width: "17cap",
                backgroundColor: "#4CAF50",
                borderColor: "#4A2F1A",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn btn-secondary rounded-pill"
              style={{
                width: "17cap",
                backgroundColor: "#6C757D",
                borderColor: "#4A2F1A",
              }}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-3">
          <p style={{ color: "#FFF8E7" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#4CAF50" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
