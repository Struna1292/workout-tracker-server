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

export const emailLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5, 
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many email requests, please try again in an hour' },
});

export const globalEmailLimiter = {

	dailyTotal: 0,
	lastReset: new Date().setHours(0, 0, 0, 0),

	// reset daily counter 
	resetDailyCountIfNeeded() {
		const now = new Date();
		const today = now.setHours(0, 0, 0, 0);

		if (this.lastReset < today) {
			this.dailyTotal = 0;
			this.lastReset = today;
		}
	}
};