const Stylist = require("../models/stylistModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getallstylists = async (req, res) => {
  try {
    console.log("Getting all stylists..."); // Debug log
    
    // Get all stylist records from Stylist collection
    const stylistRecords = await Stylist.find({}).populate("userId");
    console.log("Stylist records found:", stylistRecords.length); // Debug log
    
    // Get all users who are marked as stylists
    const stylistUsers = await User.find({ isStylist: true }).select('-password');
    console.log("Users marked as stylists:", stylistUsers.length); // Debug log
    
    // Combine both sources
    const allStylists = [];
    
    // Add stylist records first
    stylistRecords.forEach(record => {
      allStylists.push(record);
    });
    
    // Add users marked as stylists who don't have stylist records
    stylistUsers.forEach(user => {
      const hasStylistRecord = stylistRecords.some(record => 
        record.userId._id.toString() === user._id.toString()
      );
      
      if (!hasStylistRecord) {
        // Create a stylist object for users marked as stylists
        allStylists.push({
          _id: user._id,
          userId: user,
          specialization: "General Stylist",
          experience: 0,
          fees: 0,
          timing: "morning",
          applicationStatus: "approved",
          isApproved: true,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        });
      }
    });
    
    // Filter out current user if logged in
    if (req.userId) {
      allStylists = allStylists.filter(stylist => 
        stylist.userId._id.toString() !== req.userId.toString()
      );
    }
    
    console.log("Total stylists to return:", allStylists.length); // Debug log
    return res.send(allStylists);
  } catch (error) {
    console.error("Error getting stylists:", error);
    res.status(500).send("Unable to get stylists");
  }
};

const getpendingstylists = async (req, res) => {
  try {
    console.log("Getting pending stylists..."); // Debug log
    
    const stylists = await Stylist.find({ 
      applicationStatus: "pending"
    }).populate("userId");
    
    console.log("Pending stylists found:", stylists.length); // Debug log
    return res.send(stylists);
  } catch (error) {
    console.error("Error getting pending stylists:", error);
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
    // Update User model's isStylist field
    await User.findOneAndUpdate(
      { _id: req.body.id },
      { isStylist: true, status: "accepted" }
    );

    // Update Stylist model's isStylist field
    await Stylist.findOneAndUpdate(
      { userId: req.body.id },
      { 
        isStylist: true,
        applicationStatus: "approved"
      }
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