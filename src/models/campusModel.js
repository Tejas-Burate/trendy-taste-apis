const { Schema, model } = require("mongoose");
const Restaurant = require('./restaurantModel');
const User = require('./userModel');

// const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
const currentDate = new Date().toLocaleString();
console.log('currentDate', currentDate)

const campusSchema = new Schema(
    {
        campusName: {
            type: String,
            required: [true, "Campus Name is required"],
            unique: false,
        },

        location: {
            type: String,
            required: [true, "Campus Location is required"],
        },

        description: {
            type: String,
            required: [true, "Campus Description is required"],
        },

        createdBy: {
            type: String,
            // required: [true, "adminId is required"],
            ref: 'users',
            validate: {
                // Custom validator to check if the referenced roleId exists in the "Roles" collection
                async validator(createdBy) {
                    const admin = await User.findOne({_id : createdBy });
                    console.log('admin', admin)
                    return admin !== null; // Return true if the role exists, false otherwise
                },
                message: "Invalid adminId. Admin does not exist in the 'Users' collection.",
            },
        },
        
        createdAt: {
            type: String,
            // required: true,
            default : Date().toLocaleString(), // Manually set the createdAt timestamp when creating a document
        },



        updatedAt: {
            type: Date,
            // required: true, 
            default : currentDate, // Manually set the updatedAt timestamp when creating a document
        },
    },
    // {
    //     timestamps: true,
    // }
);



module.exports = model("campus", campusSchema);
