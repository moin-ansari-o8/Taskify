import "./App.css";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

// Import pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import SignUpForm from "./pages/SignUpForm";
import SignInForm from "./pages/SignInForm";
import Boards from "./pages/Boards";
import Cards from "./pages/Cards";
import EditUser from "./pages/EditUser";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Component
const ProtectedRoute = ({ element, requireAdmin = false }) => {
  const isLoggedIn = !!localStorage.getItem("username");
  const userRole = localStorage.getItem("role") || "user";

  if (!isLoggedIn) {
    return <Navigate to="/homepage" replace />;
  }

  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const noSidebarRoutes = ["/homepage", "/signin", "/signup"];
  const isLoggedIn = !!localStorage.getItem("username");
  const userRole = localStorage.getItem("role") || "user";
  const isAdmin = userRole === "admin";

  // Hide sidebar for admins or on noSidebarRoutes
  const showSidebar =
    isLoggedIn && !isAdmin && !noSidebarRoutes.includes(location.pathname);

  const contentClass =
    noSidebarRoutes.includes(location.pathname) || isAdmin
      ? "content no-sidebar"
      : isSidebarCollapsed
      ? "content sidebar-collapsed"
      : "content sidebar-expanded";

  return (
    <div className="App">
      <NavBar hideButtons={noSidebarRoutes.includes(location.pathname)} />
      {showSidebar && (
        <SideBar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      )}
      <div className={contentClass}>
        <Routes>
          {/* Public Routes */}
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/boards"
            element={<ProtectedRoute element={<Boards />} />}
          />
          <Route
            path="/cards"
            element={<ProtectedRoute element={<Cards />} />}
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute element={<AdminDashboard />} requireAdmin />
            }
          />
          <Route
            path="/admin-dashboard/edit-user/:username"
            element={<ProtectedRoute element={<EditUser />} requireAdmin />}
          />

          {/* Wildcard Route */}
          <Route
            path="*"
            element={
              isLoggedIn ? (
                isAdmin ? (
                  <Navigate to="/admin-dashboard" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Navigate to="/homepage" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
