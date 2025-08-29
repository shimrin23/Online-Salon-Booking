const express = require("express");
const cors = require("cors");
require("dotenv").config();  // Loads .env variables
require("./db/conn");        // Make sure this file connects to MongoDB
const userRouter = require("./routes/userRoutes");
const stylistRouter = require("./routes/stylistRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;  // Change this line

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/stylist", stylistRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("✅ Backend server is running on port 5001");
});


// Serve frontend (commented out for development)
// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
