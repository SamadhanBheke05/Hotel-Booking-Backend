import jwt from "jsonwebtoken";

/**
 * Unified Authentication Middleware
 * Verifies JWT token from cookies and attaches user data to request
 */
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token",
                success: false,
            });
        }

        // Verify token with correct JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = decoded;

        next();

    } catch (error) {
        // Handle expired or invalid tokens
        return res.status(401).json({
            message: "Unauthorized - Invalid token",
            success: false,
        });
    }
};

export default authMiddleware;
