const { Schema, model } = require("mongoose");
const Campus = require('./campusModel');
const User = require('./userModel');

const campusDetailsSchema = new Schema(
  {
    campusId: {
      type: String,
      ref: 'campus',
      validate: {
        async validator(campusId) {
          const campus = await Campus.findOne({ _id: campusId });
          console.log('Campus', campus);
          return campus !== null;
        },
        message: "Invalid campusId. Campus does not exist in the 'Campus' collection.",
      },
    },

    createdBy: {
      type: String,
      ref: 'users',
      validate: {
        async validator(createdBy) {
          const user = await User.findOne({ _id: createdBy });
          console.log('User', user);
          return user !== null;
        },
        message: "Invalid UserId. User does not exist in the 'User' collection.",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("campusDetails", campusDetailsSchema);
