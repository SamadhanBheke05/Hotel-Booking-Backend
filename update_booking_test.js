import mongoose from "mongoose";
import Booking from "./models/booking.model.js";
import dotenv from "dotenv";

dotenv.config();

const updateBooking = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const bookingId = "6982168d26dd29100115ef79"; // ID from the screenshot

        // Today is Feb 3, 2026.
        const result = await Booking.findByIdAndUpdate(
            bookingId,
            {
                checkIn: new Date("2026-02-01"),
                checkOut: new Date("2026-02-02"),
                status: "confirmed" // Ensure it's not cancelled
            },
            { new: true }
        );

        if (result) {
            console.log("Booking updated successfully:");
            console.log(result);
        } else {
            console.log("Booking not found");
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("Error updating booking:", error);
        process.exit(1);
    }
};

updateBooking();
