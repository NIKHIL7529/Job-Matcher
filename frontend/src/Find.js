import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Find.css";
import { useSearchParams } from "react-router-dom";

function FindJobsByLocation() {
  const [location, setLocation] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loc, setloc] = useSearchParams();
  useEffect(() => {
    const location = loc.get("loc");
    const fetchJobsByLocation = async () => {
      try {
        const response = await axios.get(
          `https://job-matcher-kmuw.onrender.com/api/jobs/location/${location}`
        );
        setHtmlContent(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setHtmlContent("<h1>No jobs found for the specified location</h1>");
      }
    };
    fetchJobsByLocation();
  }, [loc]);
  const fetchJobsByLocation = async () => {
    try {
      const response = await axios.get(
        `https://job-matcher-kmuw.onrender.com/api/jobs/location/${location}`
      );
      setHtmlContent(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setHtmlContent("<h1>No jobs found for the specified location</h1>");
    }
  };

  return (
    <div className="find-jobs">
      <h1>Find Jobs by Location</h1>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={fetchJobsByLocation}>Search</button>
      </div>
      <div
        className="job-listings"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export default FindJobsByLocation;
