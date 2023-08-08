const { Schema, model } = require("mongoose");

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
            required: [true, "Category Description is required"],
            ref: 'restaurants',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = model("categories", categorySchema);
