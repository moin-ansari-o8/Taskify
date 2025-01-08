import React, { useState } from "react";
// import "./SignInForm.css"; // Import custom CSS

import { Link } from "react-router-dom";
const SignInForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false, // State to track the remember me switch
  });

  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  // Function to clear form fields
  const handleClear = () => {
    setFormData({
      username: "",
      password: "",
      rememberMe: false, // Reset remember me
    });
    setShowPassword(false); // Reset password visibility
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4"
        style={{
          width: "500px",
          background:
            "linear-gradient(to bottom,rgba(107, 79, 59, 0.33),rgb(153, 131, 109))",
          borderRadius: "10px",
          border: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="card-title text-center" style={{ fontSize: "30px" }}>
          Sign In
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username" // Placeholder added
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-1">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password" // Placeholder added
                required
              />
              <div className="form-check ms-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPassword"
                  onChange={togglePasswordVisibility}
                  checked={showPassword}
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
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>

          <div className="d-flex justify-content-between gap-2 mt-4">
            <button type="submit" className="btn" style={{ width: "17cap" }}>
              Sign In
            </button>

            {/* Clear Button */}
            <button
              type="button"
              className="btn"
              style={{ width: "17cap" }}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-3">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
