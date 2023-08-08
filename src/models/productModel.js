const { Schema, model } = require("mongoose");

const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: [true, "Category Name is required"],
            unique: true,
        },

        productImg: {
            type: String,
            required: [true, "Category Image is required"],
        },

        price: {
            type: Number,
            required: [true, "Category price is required"],
        },

        categoryId: {
            type: Schema.Types.ObjectId,
            required: [true, "Category Id is required"],
            ref: 'categories',
        },

        restaurantId: {
            type: Schema.Types.ObjectId,
            required: [true, "Restaurant Id is required"],
            ref: 'restaurants',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = model("products", productSchema);
