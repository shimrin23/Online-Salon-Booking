const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Stylist = require("../models/stylistModel");

const getallappointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [{ userId: req.query.search }, { stylistId: req.query.search }],
        }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("userId", "firstname lastname mobile pic");
    
    // Manually populate stylist data
    for (let appointment of appointments) {
      try {
        // Find the stylist document that has userId matching the stylistId
        const stylist = await Stylist.findOne({ 
          userId: appointment.stylistId
        });
        
        if (stylist) {
          // Get the user data for this stylist
          const stylistUser = await User.findById(stylist.userId);
          if (stylistUser) {
            // Create a stylistId object with the user data
            appointment.stylistId = {
              _id: stylist._id,
              userId: stylistUser
            };
          }
        }
      } catch (populateError) {
        console.error("Error populating stylist for appointment:", appointment._id, populateError);
      }
    }
    
    console.log("Populated appointments:", appointments);
    return res.send(appointments);
  } catch (error) {
    console.error("Error getting appointments:", error);
    res.status(500).send("Unable to get appointments");
  }
};

const bookappointment = async (req, res) => {
  try {
    console.log("=== BOOK APPOINTMENT FUNCTION CALLED ===");
    
    // Find the stylist document that has the userId matching req.body.stylistId
    const stylist = await Stylist.findOne({ userId: req.body.stylistId });
    
    if (!stylist) {
      return res.status(400).send("Stylist not found");
    }

    const appointment = await Appointment({
      date: req.body.date,
      time: req.body.time,
      stylistId: stylist._id, // Store the Stylist ID, not the User ID
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
    console.log("=== COMPLETED FUNCTION CALLED - THIS IS THE CORRECT FUNCTION ===");
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.userId);
    
    const { appointid, status } = req.body;
    
    if (!appointid) {
      console.log("Missing appointment ID");
      return res.status(400).send("Appointment ID is required");
    }
    
    const newStatus = status || "Completed";
    console.log("New status:", newStatus);
    
    console.log("Finding and updating appointment:", appointid);
    
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: appointid },
      { status: newStatus },
      { new: true }
    );

    if (!updatedAppointment) {
      console.log("Appointment not found:", appointid);
      return res.status(404).send("Appointment not found");
    }

    console.log("Appointment updated successfully:", updatedAppointment);
    console.log("=== COMPLETED FUNCTION SUCCESS ===");
    
    return res.status(200).send({
      message: `Appointment ${newStatus.toLowerCase()}`,
      appointment: updatedAppointment
    });
    
  } catch (error) {
    console.error("=== COMPLETED FUNCTION ERROR ===");
    console.error("Error updating appointment:", error);
    console.error("Error stack:", error.stack);
    
    return res.status(500).send("Failed to update appointment status");
  }
};

module.exports = {
  getallappointments,
  bookappointment,
  completed,
};
