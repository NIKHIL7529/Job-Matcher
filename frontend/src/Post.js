import React, { useState } from "react";
import axios from "axios";
import "./Post.css";

function PostJobForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://job-matcher-kmuw.onrender.com/api/jobs", {
        jobTitle,
        description,
        location,
      });
      setSuccessMessage("Job posted successfully!");
      setJobTitle("");
      setDescription("");
      setLocation("");
    } catch (error) {
      console.error("Error posting job:", error);
      setSuccessMessage("Error posting job. Please try again.");
    }
  };

  return (
    <div className="post-job">
      <h1>Post a New Job</h1>
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title:</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Post Job</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default PostJobForm;
