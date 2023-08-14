const { Schema, model } = require("mongoose");
const Restaurant = require("./restaurantModel");
const User = require("./userModel");
const moment = require("moment-timezone");

const campusSchema = new Schema({
  campusName: {
    type: String,
    required: [true, "Campus Name is required"],
    unique: false,
  },

  location: {
    type: String,
    required: [true, "Campus Location is required"],
  },

  description: {
    type: String,
    required: [true, "Campus Description is required"],
  },

  createdBy: {
    type: String,
    // required: [true, "adminId is required"],
    ref: "users",
    validate: {
      // Custom validator to check if the referenced roleId exists in the "Roles" collection
      async validator(createdBy) {
        const admin = await User.findOne({ _id: createdBy });
        console.log("admin", admin);
        return admin !== null; // Return true if the role exists, false otherwise
      },
      message:
        "Invalid adminId. Admin does not exist in the 'Users' collection.",
    },
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

campusSchema.pre("save", function (next) {
  const timezone = process.env.TIMEZONE || "Asia/Kolkata";
  const currentDate = new Date();
  const utcOffset = moment.tz(timezone).utcOffset();
  currentDate.setUTCMinutes(currentDate.getUTCMinutes() + utcOffset);
  this.createdAt = this.updatedAt = currentDate;
  next();
});

module.exports = model("campus", campusSchema);
