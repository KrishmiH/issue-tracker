const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    assignedTo: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    severity: { type: String, enum: ["Minor", "Major", "Critical"], default: "Minor" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// helps search speed
IssueSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Issue", IssueSchema);
