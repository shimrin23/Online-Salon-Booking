const Notification = require("../models/notificationModel");

const getallnotifs = async (req, res) => {
  try {
    console.log("=== GET ALL NOTIFICATIONS ===");
    console.log("User ID from token:", req.userId);
    
    const notifs = await Notification.find({ userId: req.userId });
    console.log("Found notifications:", notifs);
    console.log("Notification count:", notifs.length);
    
    return res.send(notifs);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Unable to get all notifications");
  }
};

// Add this temporary test function
const createTestNotification = async (req, res) => {
  try {
    const testNotification = new Notification({
      userId: req.userId,
      content: "This is a test notification",
    });
    
    await testNotification.save();
    res.status(201).send("Test notification created");
  } catch (error) {
    res.status(500).send("Failed to create test notification");
  }
};

module.exports = {
  getallnotifs,
  createTestNotification, // Add this
};
