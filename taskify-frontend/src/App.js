import "./App.css";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { useState } from "react"; // Import useState for managing sidebar state

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import pages
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="App">
      <NavBar />
      <SideBar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      {/* Main content area */}
      <div
        style={{
          marginLeft: isSidebarCollapsed ? "70px" : "180px", // Adjust margin based on sidebar state
          padding: "20px",
          transition: "margin-left 0.3s ease", // Smooth transition for content movement
        }}
      >
        <h1>Welcome to Taskify</h1>
        <p>Start organizing your tasks here!</p>
      </div>
    </div>
  );
}

export default App;
