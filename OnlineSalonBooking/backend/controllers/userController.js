const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Stylist = require("../models/stylistModel");
const Appointment = require("../models/appointmentModel");

const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.send(user);
  } catch (error) {
    res.status(500).send("Unable to get user");
  }
};

const getallusers = async (req, res) => {
  try {
    const users = await User.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
    return res.send(users);
  } catch (error) {
    res.status(500).send("Unable to get all users");
  }
};

const login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const emailPresent = await User.findOne({ email: req.body.email });
    console.log("Found user:", emailPresent);

    if (!emailPresent) {
      return res.status(400).send("Incorrect credentials");
    }

    const verifyPass = await bcrypt.compare(
      req.body.password,
      emailPresent.password
    );
    console.log("Password match:", verifyPass);

    if (!verifyPass) {
      return res.status(400).send("Incorrect credentials");
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: emailPresent._id, isAdmin: emailPresent.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );

    return res.status(201).send({ msg: "User logged in successfully", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Unable to login user");
  }
};

const register = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPass });

    const result = await user.save();
    if (!result) {
      console.error("Failed to save user:", result);
      return res.status(500).send("Unable to register user");
    }

    return res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Register error:", error); // Added debug log
    res.status(500).send("Unable to register user");
  }
};

const updateprofile = async (req, res) => {
  try {
    console.log("Update profile request:", req.body); // Debug log
    console.log("User ID from token:", req.userId); // Debug log
    
    let updateData = { ...req.body };
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete updateData.password;
    }
    
    const result = await User.findByIdAndUpdate(
      { _id: req.userId },
      updateData,
      { new: true } // Return updated document
    );
    
    if (!result) {
      console.error("User not found for update:", req.userId);
      return res.status(404).send("User not found");
    }
    
    console.log("Profile updated successfully:", result);
    return res.status(201).send("User updated successfully");
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).send("Unable to update user");
  }
};

const deleteuser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.body.userId);
    const removeStylist = await Stylist.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

const toggleAdminStatus = async (req, res) => {
  try {
    // Check if the current user is an admin
    const currentUser = await User.findById(req.userId);
    if (!currentUser || !currentUser.isAdmin) {
      return res.status(403).send("Only admins can manage admin status");
    }

    const { userId, isAdmin } = req.body;
    
    // Prevent removing the last admin
    if (!isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return res.status(400).send("Cannot remove the last admin");
      }
    }

    // Prevent admin from demoting themselves
    if (userId === req.userId && !isAdmin) {
      return res.status(400).send("Cannot demote yourself from admin");
    }

    const result = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    ).select("-password");

    if (!result) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("Admin status updated successfully");
  } catch (error) {
    console.error("Toggle admin status error:", error);
    res.status(500).send("Unable to update admin status");
  }
};

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
  toggleAdminStatus, // Add this new function
};
