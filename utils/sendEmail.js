import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

// Validate email credentials are present
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS not found in environment variables");
    console.error("Please check your .env file");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || "").replace(/\s+/g, "")
    }
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email transporter verification failed:", error);
        console.error("Please check your EMAIL_USER and EMAIL_PASS in .env file");
        console.error("For Gmail, you need an App Password, not your regular password");
    } else {
        console.log("✅ Email server is ready to send messages");
    }
});

export const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `Hotel Booking <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Email Verification OTP",
            html: `
                <h2>Your OTP is: ${otp}</h2>
                <p>This OTP expires in 5 minutes.</p>
            `
        });
        console.log(`✅ OTP email sent successfully to ${email}`);
    } catch (error) {
        console.error("❌ Failed to send OTP email:", error);
        throw error; // Re-throw to handle in controller
    }
};

export const sendBookingConfirmationEmail = async ({
    email,
    name,
    bookingId,
    hotelName,
    roomType,
    checkInDate,
    checkOutDate,
    persons,
    totalPrice,
    currency = "Rs",
}) => {
    await transporter.sendMail({
        from: `Hotel Booking <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Room Booking Confirmation",
        html: `
            <h1>Hotel Booking Confirmation</h1>
            <p>Dear ${name},</p>
            <p>Thank you for booking with us. Your booking details are as follows:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${bookingId}</li>
                <li><strong>Hotel:</strong> ${hotelName}</li>
                <li><strong>Room Type:</strong> ${roomType}</li>
                <li><strong>Check-in Date:</strong> ${checkInDate}</li>
                <li><strong>Check-out Date:</strong> ${checkOutDate}</li>
                <li><strong>Number of Persons:</strong> ${persons}</li>
                <li><strong>Total Price:</strong> ${currency} ${totalPrice}</li>
            </ul>
        `,
    });
};

export const sendGroupBookingConfirmationEmail = async ({
    email,
    name,
    groupCode,
    hotelName,
    leaderName,
    roomsCount,
    totalMembers,
    checkInDate,
    checkOutDate,
    totalPrice,
    currency = "Rs",
}) => {
    await transporter.sendMail({
        from: `Hotel Booking <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Group Booking Confirmation",
        html: `
            <h2>Group Booking Confirmation</h2>
            <p>Dear ${name},</p>
            <p>Your group booking has been confirmed.</p>
            <ul>
                <li><strong>Group Code:</strong> ${groupCode}</li>
                <li><strong>Hotel:</strong> ${hotelName}</li>
                <li><strong>Leader:</strong> ${leaderName}</li>
                <li><strong>Rooms Booked:</strong> ${roomsCount}</li>
                <li><strong>Total Members:</strong> ${totalMembers}</li>
                <li><strong>Check-in:</strong> ${checkInDate}</li>
                <li><strong>Check-out:</strong> ${checkOutDate}</li>
                <li><strong>Total Price:</strong> ${currency}${totalPrice}</li>
            </ul>
        `,
    });
};

