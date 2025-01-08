import React, { useState } from "react";
// import "./SignUpForm.css"; // Import custom CSS

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      email: "",
      password: "",
      role: "user",
    });
    setShowPassword(false); // Reset password visibility
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4"
        style={{
          width: "500px",
          height: "70%",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="card-title text-center">Sign Up</h3>
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
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          {/* Role Field */}
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
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

          <button type="submit" className="btn btn-primary w-100 mb-2 mt-4">
            Sign Up
          </button>

          {/* Clear Button */}
          <button
            type="button"
            className="btn btn-secondary w-100"
            onClick={handleClear}
          >
            Clear
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-3">
          <p>
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
