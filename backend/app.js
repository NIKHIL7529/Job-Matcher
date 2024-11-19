const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public/")));

const corsOptions = {
  origin: process.env.frontend,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  description: String,
  location: String,
});

const Job = mongoose.model("Job", jobSchema);

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    let htmlContent = `
      <html>
        <head>
          <title>Jobs</title>
          <link rel="stylesheet" href=${process.env.style}> <!-- Link to the CSS file -->
        </head>
        <body>
          <h1>All Job Listings</h1>
          <ul>
    `;
    jobs.forEach((job) => {
      htmlContent += `
        <li>
          <p><strong>Job:</strong> ${job.jobTitle}</p>
          <p><strong>Description:</strong> ${job.description}</p>
          <p style= "text-transform : uppercase;"><strong>Location:</strong> ${job.location}</p>
        </li>
      `;
    });
    htmlContent += `
      </ul>
    </body>
    </html>
    `;
    res.send(htmlContent);
  } catch (err) {
    console.log("Error retrieving jobs:", err);
    res.status(500).send("Error retrieving jobs");
  }
});

app.get("/api/jobs/location/:location", async (req, res) => {
  const { location } = req.params;
  const loc = location.toLowerCase()

  try {
    const jobs = await Job.find({ location: loc });
    if (jobs.length === 0) {
      return res
        .status(404)
        .send(`<h1 style= "text-transform : uppercase;">No jobs found for location: ${location}</h1>`);
    }

    let htmlContent = `
        <html>
          <head>
            <title style= "text-transform : uppercase;">Jobs in ${location}</title>
            <link rel="stylesheet" href="${process.env.style}">
          </head>
          <body>
            <h1 style= "text-transform : uppercase;">Job Listings for ${location}</h1>
            <ul>
      `;

    jobs.forEach((job) => {
      htmlContent += `
          <li>
            <p><strong>Job:</strong> ${job.jobTitle}</p>
            <p><strong>Description:</strong> ${job.description}</p>
            <p style= "text-transform : uppercase;"><strong>Location:</strong> ${job.location}</p>
          </li>
        `;
    });

    htmlContent += `
            </ul>
          </body>
        </html>
      `;

    res.send(htmlContent);
  } catch (err) {
    console.error("Error fetching jobs by location:", err);
    res.status(500).send("<h1>Error fetching jobs</h1>");
  }
});

app.post("/api/jobs", async (req, res) => {
  const { jobTitle, description, location } = req.body;
  try {
    const loc = location.toLowerCase()
    const newJob = new Job({ jobTitle, description, loc});
    await newJob.save();
    res.redirect("/api/jobs");
  } catch (err) {
    console.log("Error posting job:", err);
    res.status(500).send("Error posting job");
  }
});

// Serve the app
app.listen(process.env.port, () => {
  console.log(`Server is running on PORT:${process.env.port}`);
});
