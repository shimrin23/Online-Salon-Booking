const express = require("express");
const auth = require("../middleware/auth");
const appointmentController = require("../controllers/appointmentController");

const appointRouter = express.Router();

appointRouter.get(
  "/getall",
  auth,
  appointmentController.getallappointments
);

appointRouter.post(
  "/book",
  auth,
  appointmentController.bookappointment
);

appointRouter.put("/complete", auth, appointmentController.completed);

module.exports = appointRouter;
