const mongoose = require("mongoose");
require("dotenv").config();

// Disable strict query warnings
mongoose.set("strictQuery", false);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Export mongoose (so you can use it in other files if needed)
module.exports = mongoose;
