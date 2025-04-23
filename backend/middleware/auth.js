const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.loggedIn && req.session.userId) {
        // Session is valid, attach user information to the request
        req.user = {
            user_id: req.session.userId,
            email: req.session.email
        };
        next();
    } else {
        return res.status(401).json({ success: false, error: "Not authenticated, please log in." });
    }
};

export default isAuthenticated;
