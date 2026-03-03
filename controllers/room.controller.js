import Room from "../models/room.model.js";

//add a new room
export const addRoom = async (req, res) => {
    try {
        const {
            roomType,
            hotel,
            pricePerNight,
            description,
            amenities,
            isAvailable,
            rating // Add rating
        } = req.body;

        // ✅ CORRECT: req.files
        const images = req.files && req.files.length > 0
            ? req.files.map(file => file.filename)
            : [];

        const newRoom = await Room.create({
            roomType,
            hotel,
            pricePerNight,
            description,
            amenities,
            isAvailable,
            rating: rating || 4.0, // Default to 4.0 if not provided
            images
        });

        return res.status(201).json({
            success: true,
            message: "Room added successfully",
            room: newRoom
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//Get all rooms for specific owner

export const getOwnerRooms = async (req, res) => {
    try {
        const { id } = req.user;

        const rooms = await Room.find().populate({
            path: "hotel",
            select: "hotelName hotelAddress rating amenities owner"
        });
        const ownerRooms = rooms.filter((room) =>
            room.hotel?.owner?.toString() === id.toString()
        );

        return res.status(200).json({
            success: true,
            rooms: ownerRooms
        });

    } catch (error) {
        console.error("Error in getOwnerRooms:", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
};

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate({
            path: "hotel",
            select: "hotelName hotelAddress amenities rating owner groupBookingAllowed maxGroupMembers maxGroupRooms",
            populate: {
                path: "owner",
                select: "name email",
            },
        })
            .exec();
        res.json({ success: true, rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



//delete
export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(roomId);

        if (!deletedRoom) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        res.json({ success: true, message: "Room deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

