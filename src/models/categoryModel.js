const { Schema, model } = require("mongoose");
const Restaurant = require('./restaurantModel');
const User = require('./userModel');

const categorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: [true, "Category Name is required"],
            unique: true,
        },

        categoryImg: {
            type: String,
            required: [true, "Category Image is required"],
        },

        description: {
            type: String,
            required: [true, "Category Description is required"],
        },

        restaurantId: {
            type: Schema.Types.ObjectId,
            required: [true, "Restaurant Id is required"],
            ref: 'restaurants',
            validate: {
                async validator(restaurantId) {
                    const restaurant = await Restaurant.findOne({ _id: restaurantId });
                    console.log('restaurant', restaurant);
                    return restaurant !== null;
                },
                message: "Invalid restaurantId. restaurantId does not exist in the 'Restaurant' collection.",
            },
        },

        restaurantManagerId: {
            type: String,
            ref: 'users',
            validate: {
                async validator(restaurantManagerId) {
                    const restaurantManager = await User.findOne({ _id: restaurantManagerId });
                    console.log('restaurantManagerId', restaurantManager);
                    return restaurantManager !== null;
                },
                message: "Invalid restaurantManagerId. restaurantManagerId does not exist in the 'Users' collection.",
            },
        }
    },
    {
        timestamps: true,
    }
);

module.exports = model("categories", categorySchema);
