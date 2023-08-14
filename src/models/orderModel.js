const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");
const User = require("./userModel");
const Restaurant = require("./restaurantModel");
const Product = require("./productModel");
const Category = require("./categoryModel");

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    validate: {
      // Custom validator to check if the referenced roleId exists in the "Roles" collection
      async validator(userId) {
        const user = await User.findOne({ _id: userId });
        console.log("user", user);
        return user !== null; // Return true if the role exists, false otherwise
      },
      message: "Invalid userId. User does not exist in the 'User' collection.",
    },
  },

  // restaurantId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'restaurant',
  //     validate: {
  //         // Custom validator to check if the referenced roleId exists in the "Roles" collection
  //         async validator(restaurantId) {
  //             const restaurant = await Restaurant.findOne({ _id : restaurantId });
  //             console.log('restaurantId', restaurantId)
  //             console.log('restaurant', restaurant)

  //             return restaurant !== null; // Return true if the role exists, false otherwise
  //         },
  //         message: "Invalid restaurantId. Restaurant does not exist in the 'Restaurant' collection.",
  //     },
  // },

  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        validate: {
          // Custom validator to check if the referenced roleId exists in the "Roles" collection
          async validator(productId) {
            console.log("productId =: ", productId);
            const product = await Product.findOne({ _id: productId });

            return product !== null; // Return true if the role exists, false otherwise
          },
          message:
            "Invalid productId. Product does not exist in the 'Product' collection.",
        },
      },
      productName: {
        type: String,
        required: [true, "Product Name is required"],
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        required: true,
      },

      categoryId: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        validate: {
          // Custom validator to check if the referenced roleId exists in the "Roles" collection
          async validator(categoryId) {
            const category = await Category.findOne({ _id: categoryId });
            console.log("categoryer", category);
            return category !== null; // Return true if the role exists, false otherwise
          },
          message:
            "Invalid categoryId. CategoryId does not exist in the 'Product' collection.",
        },
      },
    },
  ],

  totalAmount: {
    type: Number,
    // required: [true, "Total Amount is required"],
  },

  currency: {
    type: String,
    // required: [true, "String is required"],
  },

  remainingAmount: {
    type: Number,
    // required: [false, "Remaining Amount is required"],
    default: null,
  },

  orderStatus: {
    type: String,
    // required: [false, "orderStatus is required"],
    default: "Pending",
  },

  paidAmount: {
    type: Number,
    // required: [false, "paidAmount is required"],
    default: null,
  },

  rPaymentId: {
    type: String,
    // required: [false, "rPaymentID is required"],
    default: null,
  },

  rOrderId: {
    type: String,
    // required: [false, "OrderId is required"],
    default: null,
  },

  rSignature: {
    type: String,
    // required: [false, "rSignature is required"],
    default: null,
  },

  scheduleDate: {
    type: String,
    // required: [true, "scheduleDate is required"],
  },

  scheduleTime: {
    type: String,
    // required: [true, "scheduleTime is required"],
  },

  // orderDate: {
  //     type: Date,
  //     default: Date.now,
  // }
  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

orderSchema.pre("save", function (next) {
  const timezone = process.env.TIMEZONE || "Asia/Kolkata";
  const currentDate = new Date();
  const utcOffset = moment.tz(timezone).utcOffset();
  currentDate.setUTCMinutes(currentDate.getUTCMinutes() + utcOffset);
  this.createdAt = this.updatedAt = currentDate;
  next();
});

module.exports = model("orders", orderSchema);
