const express = require("express");
const cors = require("cors");
require("dotenv").config();  // Loads .env variables
require("./db/conn");
const userRouter = require("./routes/userRoutes");
const stylistRouter = require("./routes/stylistRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Corrected routes
app.use("/api/users", userRouter); // must match frontend endpoints
app.use("/api/stylist", stylistRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("✅ Backend server is running on port 5001");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
