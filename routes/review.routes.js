import express from "express";
import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

// Add a review
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { roomId, rating, comment } = req.body;
        const userId = req.user.id; // Extracted from token by authMiddleware

        // 1. Check Eligibility: User must have a completed booking for this room
        const hasBooking = await Booking.findOne({
            user: userId,
            room: roomId,
            status: "confirmed",
            checkOut: { $lt: new Date() } // Check-out date must be in the past
        });

        if (!hasBooking) {
            return res.json({ success: false, message: "You can only review rooms you have stayed in." });
        }

        // 2. Check for Duplicate Review
        const existingReview = await Review.findOne({ user: userId, room: roomId });
        if (existingReview) {
            return res.json({ success: false, message: "You have already reviewed this room." });
        }

        // 3. Create Review
        const user = await User.findById(userId);

        const review = new Review({
            user: userId,
            room: roomId,
            userName: user.name,
            rating,
            comment
        });

        await review.save();

        res.json({ success: true, message: "Review added successfully!", review });

    } catch (error) {
        console.error("Review Error:", error);
        res.json({ success: false, message: error.message });
    }
});

// Get reviews for a room
router.get("/get/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const reviews = await Review.find({ room: roomId }).sort({ createdAt: -1 }); // Newest first
        res.json({ success: true, reviews });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Check eligibility
router.get("/check-eligibility/:roomId", authMiddleware, async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        const hasBooking = await Booking.findOne({
            user: userId,
            room: roomId,
            status: "confirmed",
            checkOut: { $lt: new Date() }
        });

        const existingReview = await Review.findOne({ user: userId, room: roomId });

        if (hasBooking && !existingReview) {
            return res.json({ success: true, canReview: true });
        } else {
            return res.json({ success: true, canReview: false });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

export default router;
