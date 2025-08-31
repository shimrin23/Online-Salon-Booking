const Stylist = require("../models/stylistModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getallstylists = async (req, res) => {
  try {
    let stylists;
    if (!req.userId) {
      // Public: return all approved stylists
      stylists = await Stylist.find({ isStylist: true }).populate("userId");
    } else {
      // Exclude current logged in stylist (if any)
      stylists = await Stylist.find({ isStylist: true })
        .find({ userId: { $ne: req.userId } })
        .populate("userId");
    }

    return res.send(stylists);
  } catch (error) {
    console.error("Error getting stylists:", error); // Added logging
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
    const alreadyFound = await Stylist.findOne({ userId: req.userId });
    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }

    // Ensure all required fields are present
    const stylistData = {
      ...req.body,
      userId: req.userId,
      timing: req.body.timing || "morning" // Default timing if not provided
    };

    const stylist = new Stylist(stylistData);
    await stylist.save();

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    console.error("Stylist application error:", error); // Added logging
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

module.exports = {
  getallstylists,
  getpendingstylists,
  deletestylist,
  applyforstylist,
  acceptstylist,
  rejectstylist,
};
