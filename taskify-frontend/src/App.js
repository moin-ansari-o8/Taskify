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

// Import pages (components for each page)
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import SignUpForm from "./pages/SignUpForm";
import SignInForm from "./pages/SignInForm";
import Boards from "./pages/Boards";
import Cards from "./pages/Cards";

function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Pages where sidebar and specific navbar buttons should not appear
  const noSidebarRoutes = ["/homepage", "/signin", "/signup"];
  const isLoggedIn = !!localStorage.getItem("username"); // Check if user is logged in

  const contentClass = noSidebarRoutes.includes(location.pathname)
    ? "content no-sidebar"
    : isSidebarCollapsed
    ? "content sidebar-collapsed"
    : "content sidebar-expanded";

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
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/homepage" replace />
            }
          />
          <Route
            path="/boards"
            element={
              isLoggedIn ? <Boards /> : <Navigate to="/homepage" replace />
            }
          />
          <Route
            path="/cards"
            element={
              isLoggedIn ? <Cards /> : <Navigate to="/homepage" replace />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          {/* Redirect root or any unmatched route */}
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
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
