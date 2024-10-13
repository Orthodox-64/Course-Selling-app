const jwt = require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD } = require('../config');

function adminMiddleware(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = { adminMiddleware };