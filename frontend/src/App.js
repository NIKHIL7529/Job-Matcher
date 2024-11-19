import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Find from "./Find";
import Post from "./Post";
import "./App.css";

function App() {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("https://job-matcher-kmuw.onrender.com/api/jobs");
        setHtmlContent(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="App">
      <Router>
        <div className="App">
          <h1>Job Portal</h1>

          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/find-jobs">Find Jobs by Location</Link>
              </li>
              <li>
                <Link to="/post-job">Post New Job</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              }
            />
            <Route path="/find-jobs" element={<Find />} />
            <Route path="/post-job" element={<Post />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
