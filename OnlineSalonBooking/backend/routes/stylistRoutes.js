const express = require("express");
const stylistController = require("../controllers/stylistController");
const auth = require("../middleware/auth");

const stylistRouter = express.Router();

stylistRouter.get("/getall", stylistController.getallstylists);

stylistRouter.get("/getpending", auth, stylistController.getpendingstylists);

stylistRouter.post("/apply", auth, stylistController.applyforstylist);

stylistRouter.put("/delete", auth, stylistController.deletestylist);

stylistRouter.put("/accept", auth, stylistController.acceptstylist);

stylistRouter.put("/reject", auth, stylistController.rejectstylist);

module.exports = stylistRouter;
