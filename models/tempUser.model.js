import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    otp: String,
    otpExpiry: Date
}, {
    timestamps: true
});

export default mongoose.model("TempUser", tempUserSchema);
