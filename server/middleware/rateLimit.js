const rateLimit = require('express-rate-limit');

const dailySignupsRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000 * 24,
    limit: 3,
    message: { error: 'Too many requests, try again tomorrow.' }
});

const dailyLoginsRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000 * 24,
    limit: 20,
    message: { error: 'Too many requests, try again tomorrow.' }
});

const perMinuteRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    keyGenerator: (req) => String(req.user.userId),
    message: { error: 'Too many requests, try again in a minute.' }
});

const dailyRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000 * 24,
    limit: 50,
    keyGenerator: (req) => String(req.user.userId),
    message: { error: 'Too many requests, try again tomorrow.' }
});

module.exports = { perMinuteRateLimiter, dailyRateLimiter, dailySignupsRateLimiter, dailyLoginsRateLimiter };