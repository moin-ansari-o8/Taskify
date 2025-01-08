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
import SignInForm from "./pages/SignInForm";

function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Pages where sidebar and specific navbar buttons should not appear
  const noSidebarRoutes = ["/homepage", "/signin", "/signup"];

  const contentClass = noSidebarRoutes.includes(location.pathname)
    ? "content no-sidebar" // No sidebar
    : isSidebarCollapsed
    ? "content sidebar-collapsed" // Collapsed sidebar
    : "content sidebar-expanded"; // Sidebar expanded

  return (
    <div className="App">
      {/* Pass current route to NavBar */}
      <NavBar hideButtons={noSidebarRoutes.includes(location.pathname)} />
      {/* Conditionally render the sidebar */}
      {!noSidebarRoutes.includes(location.pathname) && (
        <SideBar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      )}
      <div className={contentClass}>
        <Routes>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
