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
    isStylist: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Stylist = mongoose.model("Stylist", schema);

module.exports = Stylist;
