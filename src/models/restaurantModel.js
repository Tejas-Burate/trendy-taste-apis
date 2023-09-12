const { Schema, model } = require("mongoose");
const Campus = require("./campusModel");
const User = require("./userModel");
const moment = require("moment-timezone");

const restaurantSchema = new Schema({
  restaurantName: {
    type: String,
    required: [true, "Full Name is required"],
  },

  location: {
    type: String,
    required: [true, "Address is required"],
  },

  restaurantImg: {
    type: String,
    required: [true, "Image is required"],
  },

  campusId: {
    type: String,
    ref: "campus",
    validate: {
      async validator(campusId) {
        const campus = await Campus.findOne({ _id: campusId });
        console.log("Campus", campus);
        return campus !== null;
      },
      message:
        "Invalid campusId. Campus does not exist in the 'Campus' collection.",
    },
  },

  createdBy: {
    type: String,
    ref: "users",
    validate: {
      async validator(createdBy) {
        const user = await User.findOne({ _id: createdBy });
        console.log("User", user);
        return user !== null;
      },
      message: "Invalid UserId. User does not exist in the 'User' collection.",
    },
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

restaurantSchema.pre("save", function (next) {
  const timezone = process.env.TIMEZONE || "Asia/Kolkata";
  const currentDate = new Date();
  const utcOffset = moment.tz(timezone).utcOffset();
  currentDate.setUTCMinutes(currentDate.getUTCMinutes() + utcOffset);
  this.createdAt = this.updatedAt = currentDate;
  next();
});

module.exports = model("restaurantaa", restaurantSchema);
