const { Schema, model } = require("mongoose");

const roleSchema = new Schema(
    {
        roleId: {
            type: Number,
            required: [true, "Role ID is required"],
            unique: true,
        },
        roleName: {
            type: String,
            required: [true, "RoleName is required"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("roles", roleSchema);
