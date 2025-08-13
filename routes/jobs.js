const express = require("express");
const router = express.Router();
const Job = require("../models/job");

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ _id: -1 }); // latest first
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error });
  }
});

// Create a new job
router.post("/", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ message: 'Job creation failed', error: err });
  }
});

// Get single job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send("Job not found");
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Invalid job ID", error: err });
  }
});

// Update job by ID
router.put("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });  // This is what you're seeing
  }
});


// Delete job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: err });
  }
});

module.exports = router;
