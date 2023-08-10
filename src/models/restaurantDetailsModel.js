const { Schema, model } = require("mongoose");
const Restaurant = require('../models/restaurantModel')
const User = require('./userModel');

const restaurantDetailsSchema = new Schema(
  {
    restaurantId: {
      type: String,
      ref: 'restaurants',
      validate: {
        async validator(restaurantId) {
          const restaurant = await Restaurant.findOne({ _id: restaurantId });
          console.log('Campus', restaurant);
          return restaurant !== null;
        },
        message: "Invalid restaurantId. Campus does not exist in the 'restaurant' collection.",
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

module.exports = model("restaurantDetails", restaurantDetailsSchema);
