import "./App.css";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { useState } from "react"; // Import useState for managing sidebar state
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"; // Use Routes instead of Switch

// Import pages (components for each page)
import HomePage from "./components/HomePage";
// import FeaturesPage from "./components/FeaturesPage";
import AboutPage from "./components/AboutPage";

// Separate component to handle the layout
function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation(); // Hook to get the current location

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Determine dynamic class for the content area
  const contentClass =
    location.pathname === "/"
      ? "content no-sidebar" // No sidebar on the homepage
      : isSidebarCollapsed
      ? "content sidebar-collapsed" // Collapsed sidebar
      : "content sidebar-expanded"; // Sidebar expanded

  return (
    <div className="App">
      {/* The NavBar is common across all pages */}
      <NavBar />

      {/* Conditionally render the SideBar */}
      {location.pathname !== "/" && (
        <SideBar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      )}

      {/* Main content area */}
      <div className={contentClass}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
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
