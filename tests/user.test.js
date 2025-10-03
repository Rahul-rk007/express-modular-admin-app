const request = require("supertest");
const app = require("../server"); // Import the app
const mongoose = require("mongoose");
const User = require("../models/User");

let createdUserId; // Fixed: No space

// Set timeout for async tests
jest.setTimeout(10000);

beforeAll(async () => {
  // Connect to test DB (separate from main DB to avoid conflicts)
  const testUri = process.env.MONGO_URI.replace("userdb", "testdb"); // Assumes your MONGO_URI ends with 'userdb'
  await mongoose.connect(testUri);
  await User.deleteMany(); // Clear any existing test data
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
  // Force Jest to detect open handles if needed (optional)
  // await new Promise(resolve => setTimeout(resolve, 1000));
});

describe("User  API Tests", () => {
  // Fixed: No extra space
  // Create a test user for ID-based tests
  beforeEach(async () => {
    await User.deleteMany(); // Ensure clean state
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      age: 28,
    });
    createdUserId = user._id;
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  // Test GET /api/users (List)
  test("GET /api/users should return list of users", async () => {
    // Ensure at least one user exists
    await User.create({
      name: "List User",
      email: "list@example.com",
      age: 30,
    });
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0); // Now guaranteed
  });

  // Test GET /api/users/:id (Detail)
  test("GET /api/users/:id should return user details", async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test User");
  });

  test("GET /api/users/:id should return 404 for invalid ID", async () => {
    const res = await request(app).get("/api/users/invalidid");
    expect(res.statusCode).toBe(404); // Now handled as 404
    expect(res.body.message).toBe("Invalid user ID"); // Updated to match new validation message
  });

  // Test POST /api/users (Add)
  test("POST /api/users should create a new user", async () => {
    const newUser = { name: "New User", email: "new@example.com", age: 40 }; // Fixed: No space
    const res = await request(app).post("/api/users").send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("new@example.com");
  });

  test("POST /api/users should return 400 for duplicate email", async () => {
    const duplicateUser = {
      name: "Duplicate",
      email: "test@example.com",
      age: 28,
    }; // Fixed: No space
    const res = await request(app).post("/api/users").send(duplicateUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User  already exists"); // Fixed: Consistent
  });

  // Test PUT /api/users/:id (Update)
  test("PUT /api/users/:id should update user", async () => {
    const updateData = { name: "Updated User", age: 29 };
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated User");
  });

  test("PUT /api/users/:id should return 404 for invalid ID", async () => {
    const res = await request(app)
      .put("/api/users/invalidid")
      .send({ name: "Update" });
    expect(res.statusCode).toBe(404); // Now handled as 404
    expect(res.body.message).toBe("Invalid user ID"); // Updated to match
  });

  // Test DELETE /api/users/:id (Delete)
  test("DELETE /api/users/:id should delete user", async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200); // Now works with findByIdAndDelete
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User  deleted"); // Fixed: Consistent
  });

  test("DELETE /api/users/:id should return 404 for invalid ID", async () => {
    const res = await request(app).delete("/api/users/invalidid");
    expect(res.statusCode).toBe(404); // Now handled as 404
    expect(res.body.message).toBe("Invalid user ID"); // Updated to match
  });
});
