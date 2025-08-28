const Stylist = require("../models/stylistModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getallstylists = async (req, res) => {
  try {
    let stylists;
    if (!req.locals) {
      stylists = await Stylist.find({ isStylist: true }).populate("userId");
    } else {
      stylists = await Stylist.find({ isStylist: true })
        .find({
          _id: { $ne: req.locals },
        })
        .populate("userId");
    }

    return res.send(stylists);
  } catch (error) {
    res.status(500).send("Unable to get stylists");
  }
};

const getpendingstylists = async (req, res) => {
  try {
    const stylists = await Stylist.find({ isStylist: false })
      .find({
        _id: { $ne: req.locals },
      })
      .populate("userId");

    return res.send(stylists);
  } catch (error) {
    res.status(500).send("Unable to get pending stylists");
  }
};

const applyforstylist = async (req, res) => {
  try {
    const alreadyFound = await Stylist.findOne({ userId: req.locals });
    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }

    const stylist = Stylist({ ...req.body, userId: req.locals });
    const result = await stylist.save();

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    res.status(500).send("Unable to submit application");
  }
};

const acceptstylist = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isStylist: true, status: "accepted" }
    );

    const stylist = await Stylist.findOneAndUpdate(
      { userId: req.body.id },
      { isStylist: true }
    );

    const notification = await Notification({
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
    const details = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isStylist: false, status: "rejected" }
    );
    const delStylist = await Stylist.findOneAndDelete({ userId: req.body.id });

    const notification = await Notification({
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
    const result = await User.findByIdAndUpdate(req.body.userId, {
      isStylist: false,
    });
    const removeStylist = await Stylist.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      stylistId: req.body.userId,
    });
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
