const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User"); // Now 'User ' without space

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected for seeding");
    // Clear existing users
    await User.deleteMany();
    console.log("Existing users cleared");

    // Dummy data
    const dummyUsers = [
      { name: "John Doe", email: "john@example.com", age: 30 },
      { name: "Jane Smith", email: "jane@example.com", age: 25 },
      { name: "Bob Johnson", email: "bob@example.com", age: 35 },
    ];

    await User.insertMany(dummyUsers);
    console.log("Dummy users inserted");

    process.exit();
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
