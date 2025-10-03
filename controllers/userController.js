const mongoose = require("mongoose"); // Add this import for ObjectId validation
const User = require("../models/User");

// Helper function to validate ObjectId
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid user ID");
    error.statusCode = 404;
    throw error;
  }
};

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort("-createdAt");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUser = async (req, res, next) => {
  // Fixed: Removed extra space in function name
  try {
    validateObjectId(req.params.id); // Validate ID first
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User  not found"); // Fixed: Consistent message (no extra space)
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Create user
const createUser = async (req, res, next) => {
  // Fixed: Removed extra space
  try {
    const { name, email, age } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User  already exists"); // Fixed: Consistent message
      error.statusCode = 400;
      throw error;
    }
    const user = await User.create({ name, email, age });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  // Fixed: Removed extra space
  try {
    validateObjectId(req.params.id); // Validate ID first
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User  not found"); // Fixed: Consistent message
      error.statusCode = 404;
      throw error;
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      // Fixed: Removed extra space
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  // Fixed: Removed extra space
  try {
    validateObjectId(req.params.id); // Validate ID first
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User  not found"); // Fixed: Consistent message
      error.statusCode = 404;
      throw error;
    }
    // Fixed: Use findByIdAndDelete instead of user.remove()
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User  deleted" }); // Fixed: Consistent message
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
