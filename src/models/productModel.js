const { Schema, model } = require("mongoose");
const Category = require('./categoryModel');

const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: [true, "Product Name is required"],
            unique: false,
        },

        productImg: {
            type: String,
            required: [true, "Product Image is required"],
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
        },

        description:{
            type : String,
            required: [true, "Product decription is required"],
        },

        status:{
            type: String,
            enum: ['Active', 'Inactive'],
            required: [true, "Product status is required"],
        },

        categoryId: {
            type: Schema.Types.ObjectId,
            required: [true, "Category Id is required"],
            ref: 'categories',
            validate: {
                async validator(categoryId) {
                    const  category = await Category.findOne({ _id: categoryId });
                    console.log('category', category);
                    return category !== null;
                },
                message: "Invalid categoryId. categoryId does not exist in the 'Categories' collection.",
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("products", productSchema);
