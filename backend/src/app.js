const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const issueRoutes = require("./routes/issue.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use(errorHandler);

module.exports = app;
