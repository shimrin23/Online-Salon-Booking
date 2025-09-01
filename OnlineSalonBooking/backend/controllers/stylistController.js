const Stylist = require("../models/stylistModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getallstylists = async (req, res) => {
  try {
    let stylists;
    if (!req.userId) {
      // Public: return all approved stylists AND pending applications
      stylists = await Stylist.find({}).populate("userId");
    } else {
      // Exclude current logged in stylist (if any)
      stylists = await Stylist.find({ userId: { $ne: req.userId } })
        .populate("userId");
    }

    return res.send(stylists);
  } catch (error) {
    console.error("Error getting stylists:", error);
    res.status(500).send("Unable to get stylists");
  }
};

const getpendingstylists = async (req, res) => {
  try {
    const stylists = await Stylist.find({ isStylist: false })
      .find({ userId: { $ne: req.userId } })
      .populate("userId");

    return res.send(stylists);
  } catch (error) {
    res.status(500).send("Unable to get pending stylists");
  }
};

const applyforstylist = async (req, res) => {
  try {
    // Check if user is already an approved stylist
    const existingStylist = await Stylist.findOne({ userId: req.userId });
    
    if (existingStylist && existingStylist.isStylist === true) {
      return res.status(400).send("You are already an approved stylist");
    }
    
    if (existingStylist && existingStylist.isStylist === false) {
      // Update existing pending application
      const updatedStylist = await Stylist.findOneAndUpdate(
        { userId: req.userId },
        {
          specialization: req.body.specialization,
          experience: Number(req.body.experience),
          fees: Number(req.body.fees),
          timing: req.body.timing || "morning"
        },
        { new: true }
      );
      
      return res.status(200).send("Application updated successfully");
    }

    // Create new application
    const stylistData = {
      specialization: req.body.specialization,
      experience: Number(req.body.experience),
      fees: Number(req.body.fees),
      timing: req.body.timing || "morning",
      userId: req.userId,
      isStylist: false
    };

    const stylist = new Stylist(stylistData);
    await stylist.save();

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    console.error("Stylist application error:", error);
    res.status(500).send("Unable to submit application");
  }
};

const acceptstylist = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.body.id },
      { isStylist: true, status: "accepted" }
    );

    await Stylist.findOneAndUpdate(
      { userId: req.body.id },
      { isStylist: true }
    );

    const notification = new Notification({
      userId: req.body.id,
      content: `Congratulations, Your stylist application has been accepted.`,
    });

    await notification.save();

    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    res.status(500).send("Error while sending notification");
  }
};

const rejectstylist = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.body.id },
      { isStylist: false, status: "rejected" }
    );
    await Stylist.findOneAndDelete({ userId: req.body.id });

    const notification = new Notification({
      userId: req.body.id,
      content: `Sorry, Your stylist application has been rejected.`,
    });

    await notification.save();

    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    res.status(500).send("Error while rejecting application");
  }
};

const deletestylist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, { isStylist: false });
    await Stylist.findOneAndDelete({ userId: req.body.userId });
    await Appointment.deleteMany({ stylistId: req.body.userId });

    return res.send("Stylist deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to delete stylist");
  }
};

// Add this function to test database connection
const testStylists = async (req, res) => {
  try {
    const allStylists = await Stylist.find({}).populate("userId");
    console.log("All stylists in database:", allStylists);
    return res.json({
      count: allStylists.length,
      stylists: allStylists,
      message: "Database connection test"
    });
  } catch (error) {
    console.error("Test error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getallstylists,
  getpendingstylists,
  deletestylist,
  applyforstylist,
  acceptstylist,
  rejectstylist,
  testStylists,
};