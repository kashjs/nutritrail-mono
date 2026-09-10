const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const token = req.cookies.token;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Missing or malformed auth token' });
    }
}

module.exports = requireAuth;