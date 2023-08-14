const { Schema, model } = require("mongoose");
const Role = require("./roleModel");
const moment = require("moment-timezone");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Full Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email Address is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  mobile: {
    type: Number,
    required: [true, "Mobile number is required"],
    unique: true,
  },
  otp: {
    type: Number,
  },
  profileImg: {
    type: String,
    default: "http://localhost:8080/images/profile/default.jpg",
    // required: [true, "Please add the profileImg"],
  },
  roleId: {
    type: Number,
    ref: "Roles",
    validate: {
      // Custom validator to check if the referenced roleId exists in the "Roles" collection
      async validator(roleId) {
        const role = await Role.findOne({ roleId });
        return role !== null; // Return true if the role exists, false otherwise
      },
      message: "Invalid roleId. Role does not exist in the 'Roles' collection.",
    },
  },

  createdBy: {
    type: String,
    ref: "Users",
    required: true,
  },

  deviceRegistrationToken: {
    type: String,
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

userSchema.pre("save", function (next) {
  const timezone = process.env.TIMEZONE || "Asia/Kolkata";
  const currentDate = new Date();
  const utcOffset = moment.tz(timezone).utcOffset();
  currentDate.setUTCMinutes(currentDate.getUTCMinutes() + utcOffset);
  this.createdAt = this.updatedAt = currentDate;
  next();
});

module.exports = model("Users", userSchema);
