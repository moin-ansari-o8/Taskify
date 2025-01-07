import "./App.css";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { useState } from "react"; // Import useState for managing sidebar state
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Use Routes instead of Switch

// Import pages (components for each page)
import HomePage from "./components/HomePage";
// import FeaturesPage from "./components/FeaturesPage";
import AboutPage from "./components/AboutPage";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Router>
      <div className="App">
        {/* The NavBar is common across all pages */}
        <NavBar />
        <SideBar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        {/* Main content area */}
        <div
          style={{
            marginLeft: isSidebarCollapsed ? "70px" : "180px", // Adjust margin based on sidebar state
            padding: "20px",
            transition: "margin-left 0.3s ease", // Smooth transition for content movement
          }}
        >
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/features" element={<FeaturesPage />} /> */}
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
