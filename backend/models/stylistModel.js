const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    timing: {
      type: String,
      default: "morning",
    },
    // Rename this to be more clear
    isApproved: {
      type: Boolean,
      default: false,
    },
    // Add application status
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  {
    timestamps: true,
  }
);

const Stylist = mongoose.model("Stylist", schema);

module.exports = Stylist;
