import rateLimit from 'express-rate-limit';

const window15m = 15 * 60 * 1000;

export const globalLimiter = rateLimit({
	windowMs: window15m,
	max: 1000, 
  	standardHeaders: true, 
  	legacyHeaders: false,
  	message: { error: 'Too many requests, please try again later.' },
});

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10, 
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many login attempts, please try again later.' },
});