import express from "express";
import {
    getOwnerDashboard,
    getOwnerRevenue,
    getOwnerHotels,
    getOwnerUsers,
    updateUserStatus,
    deleteUser,
    getOwnerGroupBookings,
} from "../controllers/ownerDashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { isOwner } from "../middlewares/isOwner.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, isOwner, getOwnerDashboard);
router.get("/revenue/:hotelId", authMiddleware, isOwner, getOwnerRevenue);
router.get("/hotels", authMiddleware, isOwner, getOwnerHotels);

// User Management Routes
router.get("/users", authMiddleware, isOwner, getOwnerUsers);
router.put("/users/:userId/status", authMiddleware, isOwner, updateUserStatus);
router.delete("/users/:userId", authMiddleware, isOwner, deleteUser);

// Group Bookings
router.get("/group-bookings", authMiddleware, isOwner, getOwnerGroupBookings);

export default router;
