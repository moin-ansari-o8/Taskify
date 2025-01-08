import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

// import "./SignUpForm.css"; // Import custom CSS
const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Added state for confirm password
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to control confirm password visibility
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log(formData);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword); // Toggle confirm password visibility
  };
  // Function to clear form fields
  const handleClear = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "", // Reset confirm password
      role: "user",
    });
    setShowPassword(false); // Reset password visibility
    setShowConfirmPassword(false); // Reset confirm password visibility
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
          Sign Up
        </h3>
        <form onSubmit={handleSubmit}>
          {}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {}
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
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
          {}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <div className="form-check ms-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showConfirmPassword"
                  onChange={toggleConfirmPasswordVisibility}
                  checked={showConfirmPassword}
                />
              </div>
            </div>
          </div>
          {}
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <div className="form-check mt-1 form-switch">
              <input
                className="form-check-input mx-1"
                type="checkbox"
                id="role"
                name="role"
                checked={formData.role === "admin"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.checked ? "admin" : "user",
                  })
                }
              />
              <label className="form-check-label" htmlFor="role">
                {formData.role === "admin" ? "Admin" : "User"}
              </label>
            </div>
          </div>
          <div className="d-flex justify-content-between gap-2 mt-4">
            <button type="submit" className="btn" style={{ width: "17cap" }}>
              Sign Up
            </button>
            {}
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
        {}
        <div className="text-center mt-3">
          <p>
            Remember your account details? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUpForm;
