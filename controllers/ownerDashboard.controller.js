import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";

/**
 * GET ALL HOTELS FOR OWNER (Dropdown)
 * GET /api/owner/hotels
 */
export const getOwnerHotels = async (req, res) => {
  try {
    // Fetch ALL hotels for Admin panel
    const hotels = await Hotel.find({}).select("hotelName _id");

    res.json({
      success: true,
      hotels,
    });
  } catch (error) {
    console.error("❌ Owner Hotels Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * OWNER DASHBOARD (Top Cards)
 * GET /api/owner/dashboard
 */
export const getOwnerDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find().populate({
      path: "room",
      populate: {
        path: "hotel",
      },
    });

    const ownerBookings = bookings.filter((b) => b.room?.hotel);

    const totalBookings = ownerBookings.length;

    const totalRevenue = ownerBookings.reduce((sum, booking) => {
      // Include revenue if the booking is NOT cancelled.
      if (booking.status !== "cancelled") {
        return sum + Number(booking.totalPrice || 0);
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * OWNER REVENUE PAGE (Specific Hotel)
 * GET /api/owner/revenue/:hotelId
 */
export const getOwnerRevenue = async (req, res) => {
  try {
    const { hotelId } = req.params;

    let bookings = [];

    if (hotelId === "all") {
      // Fetch ALL hotels (Global Admin View)
      const hotels = await Hotel.find({}).select("_id");
      const hotelIds = hotels.map(h => h._id);

      // Fetch ALL bookings for these hotels
      bookings = await Booking.find({ hotel: { $in: hotelIds } })
        .populate("user", "name email")
        .populate("room", "roomType")
        .populate("hotel", "hotelName") // Populate hotel name for "All" view
        .sort({ createdAt: -1 });

    } else {
      // Verify hotel exists (Removed owner check for Global Admin)
      const hotel = await Hotel.findOne({ _id: hotelId });

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found or unauthorized",
        });
      }

      bookings = await Booking.find({ hotel: hotelId })
        .populate("user", "name email")
        .populate("room", "roomType")
        .sort({ createdAt: -1 });
    }

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce((sum, booking) => {
      // Include revenue if the booking is NOT cancelled.
      // This includes 'paid' (online), 'pending' (Pay at Hotel/Offline), etc.
      if (booking.status !== "cancelled") {
        return sum + Number(booking.totalPrice || 0);
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      totalBookings,
      totalRevenue,
      recentBookings: bookings,
    });
  } catch (error) {
    console.error("Revenue Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET USERS FOR OWNER
 * GET /api/owner/users
 */
export const getOwnerUsers = async (req, res) => {
  try {
    // Fetch ALL users with role "user" (customers)
    // This ensures all registered customers are visible, even if they haven't made bookings yet
    const users = await User.find({ role: "user" })
      .select("-password") // Exclude password
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE USER STATUS
 * PUT /api/owner/users/:userId/status
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
      user,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE USER
 * DELETE /api/owner/users/:userId
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET OWNER GROUP BOOKINGS
 * GET /api/owner/group-bookings
 */
export const getOwnerGroupBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      bookingType: "group",
    })
      .populate("user", "name email")
      .populate("hotel", "hotelName hotelAddress")
      .populate("rooms.roomId", "roomType pricePerNight")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get Owner Group Bookings Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
