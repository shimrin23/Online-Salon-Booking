const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
require("./db/conn");
const userRouter = require("./routes/userRoutes");
const stylistRouter = require("./routes/stylistRoutes");
const appointRouter = require("./routes/appointRoutes");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


app.use("/api/users", userRouter); 
app.use("/api/stylist", stylistRouter);
app.use("/api/appointment", appointRouter);

app.get("/", (req, res) => {
  res.send("✅ Backend server is running on port 5001");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
