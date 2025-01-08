import "./App.css";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { useState } from "react"; // Import useState for managing sidebar state
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// Import pages (components for each page)
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard"; // Import the Dashboard component
import SignUpForm from "./pages/SignUpForm";

function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const contentClass =
    location.pathname === "/"
      ? "content no-sidebar" // No sidebar on the homepage
      : isSidebarCollapsed
      ? "content sidebar-collapsed" // Collapsed sidebar
      : "content sidebar-expanded"; // Sidebar expanded

  return (
    <div className="App">
      <NavBar />
      {location.pathname !== "/" && (
        <SideBar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      )}
      <div className={contentClass}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homepage" element={<Dashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<AboutPage />} />
          <Route path="/dashboard" element={<Dashboard />} />{" "}
          {/* Add Dashboard */}
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
