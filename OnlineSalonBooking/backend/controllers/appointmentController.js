const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

const getallappointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [{ userId: req.query.search }, { stylistId: req.query.search }],
        }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("stylistId")
      .populate("userId");
    return res.send(appointments);
  } catch (error) {
    res.status(500).send("Unable to get appointments");
  }
};

const bookappointment = async (req, res) => {
  try {
    const appointment = await Appointment({
      date: req.body.date,
      time: req.body.time,
      stylistId: req.body.stylistId,
      userId: req.userId,
    });

    const usernotification = Notification({
      userId: req.userId,
      content: `You booked an appointment with ${req.body.stylistName} for ${req.body.date} ${req.body.time}`,
    });

    await usernotification.save();

    const user = await User.findById(req.userId);

    const stylistnotification = Notification({
      userId: req.body.stylistId,
      content: `You have an appointment with ${user.firstname} ${user.lastname} on ${req.body.date} at ${req.body.time}`,
    });

    await stylistnotification.save();

    const result = await appointment.save();
    return res.status(201).send(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to book appointment");
  }
};

const completed = async (req, res) => {
  try {
    const alreadyFound = await Appointment.findOneAndUpdate(
      { _id: req.body.appointid },
      { status: "Completed" }
    );

    const usernotification = Notification({
      userId: req.userId,
      content: `Your appointment with ${req.body.stylistName} has been completed`,
    });

    await usernotification.save();

    const user = await User.findById(req.userId);

    const stylistnotification = Notification({
      userId: req.body.stylistId,
      content: `Your appointment with ${user.firstname} ${user.lastname} has been completed`,
    });

    await stylistnotification.save();

    return res.status(201).send("Appointment completed");
  } catch (error) {
    res.status(500).send("Unable to complete appointment");
  }
};

module.exports = {
  getallappointments,
  bookappointment,
  completed,
};
