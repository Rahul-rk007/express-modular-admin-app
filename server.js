const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Init app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", (req, res) => {
  return res.status(200).json({
    message: "This is a new feature for product api (new)",
  });
});

// Error handler middleware
app.use(errorHandler);

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Export app for testing
module.exports = app;

// Start server only if not in test mode
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
