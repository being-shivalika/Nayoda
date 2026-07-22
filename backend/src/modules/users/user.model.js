import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 72,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    roles: {
        type: String,
        enum: ["client", "freelancer", "admin"],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        default: "",
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

export default User;