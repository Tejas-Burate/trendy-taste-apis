const { Schema, model } = require("mongoose");
const User = require('./userModel');
const Restaurant = require('./restaurantModel');
const Product = require('./productModel');

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            validate: {
                // Custom validator to check if the referenced roleId exists in the "Roles" collection
                async validator(userId) {
                    const user = await User.findOne({ _id :userId });
                    console.log('user', user)
                    return user !== null; // Return true if the role exists, false otherwise
                },
                message: "Invalid userId. User does not exist in the 'User' collection.",
            },
        },

        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'restaurant',
            validate: {
                // Custom validator to check if the referenced roleId exists in the "Roles" collection
                async validator(restaurantId) {
                    const restaurant = await Restaurant.findOne({ _id : restaurantId });
                    console.log('restaurantId', restaurantId)
                    console.log('restaurant', restaurant)

                    return restaurant !== null; // Return true if the role exists, false otherwise
                },
                message: "Invalid restaurantId. Restaurant does not exist in the 'Restaurant' collection.",
            },
        },

        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    validate: {
                        // Custom validator to check if the referenced roleId exists in the "Roles" collection
                        async validator(productId) {
                            const product = await Product.findOne({ _id : productId });
                           
        
                            return product !== null; // Return true if the role exists, false otherwise
                        },
                        message: "Invalid productId. Product does not exist in the 'Product' collection.",
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
                unit_price: {
                    type: Number,
                    required: true,
                },
                total_price: {
                    type: Number,
                    required: true,
                },
            }
        ], 

        orderDate: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = model("orders", orderSchema);
