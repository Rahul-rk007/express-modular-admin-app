const express = require("express");
const {
  getUsers,
  getUser, // Fixed: No extra space
  createUser, // Fixed: No extra space
  updateUser, // Fixed: No extra space
  deleteUser, // Fixed: No extra space
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
