import jwtService from "../../modules/auth/jwt.service.js";
import ApiError from "../errors/ApiErrors.js";

// Verifies the Bearer JWT and attaches { id, role } to req.user
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Not authorized, no token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwtService.verifyAccessToken(token);

        req.user = { id: decoded.id, role: decoded.role };

        next();
    } catch (error) {
        next(new ApiError(401, "Not authorized, token invalid or expired"));
    }
};

// Restricts access to specific roles, e.g. authorize("admin")
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, "Not authorized"));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(403, `Role '${req.user.role}' cannot access this resource`)
            );
        }

        next();
    };
};

export { protect, authorize };
