const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const roleSchema = new Schema({
  roleId: {
    type: Number,
    required: [true, "Role ID is required"],
    unique: true,
  },
  roleName: {
    type: String,
    required: [true, "RoleName is required"],
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

roleSchema.pre("save", function (next) {
  const timezone = process.env.TIMEZONE || "Asia/Kolkata";
  const currentDate = new Date();
  const utcOffset = moment.tz(timezone).utcOffset();
  currentDate.setUTCMinutes(currentDate.getUTCMinutes() + utcOffset);
  this.createdAt = this.updatedAt = currentDate;
  next();
});

module.exports = model("roles", roleSchema);
