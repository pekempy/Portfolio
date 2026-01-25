import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { error: 'Too many login attempts, please try again later.' }
});

export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
});
