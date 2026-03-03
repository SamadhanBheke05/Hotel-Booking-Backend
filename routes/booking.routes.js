import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { isOwner } from "../middlewares/isOwner.js";
import {
    bookRoom,
    checkRoomAvailability,
    getHotelBookings,
    getUserBookings,
    cancelBooking,
    createGroupBooking,
    getUserGroupBookings,
    cancelGroupBooking,
} from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

// ── Single Booking Routes ──────────────────────────────────
bookingRouter.post("/check-availability", checkRoomAvailability);
bookingRouter.post("/book", authMiddleware, bookRoom);
bookingRouter.get("/user", authMiddleware, getUserBookings);
bookingRouter.get("/hotel", authMiddleware, isOwner, getHotelBookings);
bookingRouter.put("/cancel/:id", authMiddleware, cancelBooking);

// ── Group Booking Routes ───────────────────────────────────
bookingRouter.post("/group", authMiddleware, createGroupBooking);
bookingRouter.get("/user/group", authMiddleware, getUserGroupBookings);
bookingRouter.delete("/group/:id", authMiddleware, cancelGroupBooking);

export default bookingRouter;