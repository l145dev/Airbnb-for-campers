import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// to be used when trying to access locked pages like profile and when authorization is needed to perform an action like booking or becoming an owner.
const verifyToken = (req, res, next) => {
    // get bearer token from frontend (authorization: Bearer eyJhbGciOiJ...)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided, login again." });
    }

    try {
        // verify the user, get id and email in object format
        const user = jwt.verify(token, JWT_SECRET);
        // attach user object to req.user (can be used like req.user.id and req.user.email)
        req.user = user;
        // continue with rest of the code in main route
        next();
    }

    catch (error) {
        // invalid token, needs to log in again
        return res.status(403).json({ error: "Invalid token" });
    }
}

export default verifyToken;
