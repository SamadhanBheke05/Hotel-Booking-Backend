import mongoose from "mongoose";

const hotelRoomSchema = new mongoose.Schema(
    {
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },
        roomType: { type: String, required: true },
        pricePerNight: { type: Number, required: true },
        description: { type: String, required: true },
        images: {
            type: [String],
            validate: [arr => arr.length > 0, "At least one image required"]
        },


        amenities: { type: String, required: true },
        rating: { type: Number, default: 4.0, min: 0, max: 5 },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Room = mongoose.model("Room", hotelRoomSchema);
export default Room;