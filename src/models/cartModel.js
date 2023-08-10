const { Schema, model } = require("mongoose");
const Product = require('./productModel');
const User = require('./userModel');

const cartSchema = new Schema(
  {
    productId: {
      type: String,
      ref: 'products',
      validate: {
        async validator(productId) {
          const product = await Product.findOne({ _id: productId });
          console.log('Campus', product);
          return product !== null;
        },
        message: "Invalid productId. Campus does not exist in the 'Product' collection.",
      },
    },

    userId: {
      type: String,
      ref: 'users',
      validate: {
        async validator(userId) {
          const user = await User.findOne({ _id: userId });
          console.log('User', user);
          return user !== null;
        },
        message: "Invalid UserId. User does not exist in the 'User' collection.",
      },
    },

    quantity: {
        type: Number,
        required: [true, "Address is required"],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("carts", cartSchema);
