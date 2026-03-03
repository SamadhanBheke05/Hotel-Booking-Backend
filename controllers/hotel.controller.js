import Hotel from "../models/hotel.model.js";

export const registerHotel = async (req, res) => {
    const { id } = req.user;
    try {
        const { hotelName, hotelAddress, location, rating, price, amenities,
            groupBookingAllowed, maxGroupMembers, maxGroupRooms } = req.body;
        const image = req.file?.filename;
        if (!hotelName || !hotelAddress || !location || !rating || !price || !amenities || !image) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const newHotel = new Hotel({
            hotelName,
            hotelAddress,
            location,
            rating,
            price,
            amenities,
            image,
            owner: id,
            groupBookingAllowed: groupBookingAllowed === "true" || groupBookingAllowed === true,
            maxGroupMembers: Number(maxGroupMembers) || 0,
            maxGroupRooms: Number(maxGroupRooms) || 0,
        });
        await newHotel.save();
        return res.status(201).json({ message: "Hotel registered successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update hotel (including group booking settings)
export const updateHotel = async (req, res) => {
    const { hotelId } = req.params;
    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found", success: false });
        }

        const { hotelName, hotelAddress, location, rating, price, amenities,
            groupBookingAllowed, maxGroupMembers, maxGroupRooms } = req.body;

        hotel.hotelName = hotelName || hotel.hotelName;
        hotel.hotelAddress = hotelAddress || hotel.hotelAddress;
        hotel.location = location || hotel.location;
        hotel.rating = rating || hotel.rating;
        hotel.price = price || hotel.price;
        hotel.amenities = amenities || hotel.amenities;
        hotel.groupBookingAllowed = groupBookingAllowed === "true" || groupBookingAllowed === true;
        hotel.maxGroupMembers = Number(maxGroupMembers) || 0;
        hotel.maxGroupRooms = Number(maxGroupRooms) || 0;

        // Only update image if a new one is uploaded
        if (req.file?.filename) {
            hotel.image = req.file.filename;
        }

        await hotel.save();
        return res.status(200).json({ message: "Hotel updated successfully", success: true, hotel });
    } catch (error) {
        console.error("Update Hotel Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Get owner hotels
export const getOwnerHotels = async (req, res) => {
    const { id } = req.user;
    try {
        const hotels = await Hotel.find({ owner: id }).populate("owner", "name email");
        return res.status(200).json({ hotels, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Get all hotels
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({}).populate("owner", "name email");
        return res.status(200).json({ hotels, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//delete hotel
export const deleteHotel = async (req, res) => {
    const { hotelId } = req.params;
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
        if (!deletedHotel) {
            return res.status(404).json({ message: "Hotel not Found" });
        } else {
            return res.status(200).json({ message: "Hotel Deleted Successfully", success: true });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
