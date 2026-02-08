const Issue = require("../models/Issue");
const asyncHandler = require("../utils/asyncHandler");

// Create
exports.createIssue = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, priority, severity } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Title & description required" });

  const issue = await Issue.create({
    title,
    description,
    assignedTo: assignedTo || "",
    priority: priority || "Medium",
    severity: severity || "Minor",
    createdBy: req.user.id,
  });

  res.status(201).json(issue);
});

// List with pagination + filters + search
exports.listIssues = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);

  const { status, priority, q } = req.query;

  const filter = { createdBy: req.user.id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Issue.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Issue.countDocuments(filter),
  ]);

  res.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

// Counts by status (for dashboard)
exports.statusCounts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const results = await Issue.aggregate([
    { $match: { createdBy: require("mongoose").Types.ObjectId.createFromHexString(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts = { Open: 0, "In Progress": 0, Resolved: 0, Closed: 0 };
  for (const r of results) counts[r._id] = r.count;

  res.json(counts);
});

// Read one
exports.getIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!issue) return res.status(404).json({ message: "Issue not found" });
  res.json(issue);
});

// Update
exports.updateIssue = asyncHandler(async (req, res) => {
  const updated = await Issue.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    { $set: req.body },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Issue not found" });
  res.json(updated);
});

// Mark status with confirmation handled in frontend
exports.setStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["Open", "In Progress", "Resolved", "Closed"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const updated = await Issue.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    { $set: { status } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Issue not found" });
  res.json(updated);
});

// Delete
exports.deleteIssue = asyncHandler(async (req, res) => {
  const deleted = await Issue.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
  if (!deleted) return res.status(404).json({ message: "Issue not found" });
  res.json({ message: "Deleted" });
});
