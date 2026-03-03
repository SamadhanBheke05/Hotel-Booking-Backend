import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js";
import { isOwner } from "../middlewares/isOwner.js"
import { deleteHotel, getAllHotels, getOwnerHotels, registerHotel, updateHotel } from "../controllers/hotel.controller.js";
import { upload } from "../config/multer.js";

const hotelRouter = express.Router();

hotelRouter.post("/register", authMiddleware, isOwner, upload.single("image"), registerHotel);
hotelRouter.put("/update/:hotelId", authMiddleware, isOwner, upload.single("image"), updateHotel);
hotelRouter.get("/get", authMiddleware, isOwner, getOwnerHotels);
hotelRouter.get("/get-all", getAllHotels);
hotelRouter.delete("/delete/:hotelId", authMiddleware, isOwner, deleteHotel);

export default hotelRouter;