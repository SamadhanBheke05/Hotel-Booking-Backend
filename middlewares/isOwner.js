/**
 * Owner Authorization Middleware
 * Checks if authenticated user has owner role
 * Must be used after authMiddleware
 */
export const isOwner = (req, res, next) => {
    try {
        if (req.user && req.user.role === "owner") {
            next();
        } else {
            return res.status(403).json({
                message: "Forbidden - Owner access required",
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}