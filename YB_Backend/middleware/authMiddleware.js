import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token ||  req.headers.authorization?.split( '')[1];
    if (!token) return res.status(401).json({ message: 'Unautherized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access denied' })
        }
        next();
    };
};
