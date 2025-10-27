import nodemailer from 'nodemailer';
import { globalEmailLimiter } from '../middlewares/rateLimiter.js';

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const EMAIL_LIMIT = process.env.EMAIL_LIMIT;

const sendEmail = async (email, subject, message) => {
    // check daily limit
    if (globalEmailLimiter.dailyTotal >= EMAIL_LIMIT) {
        throw new Error('Daily email limit reached. Please try again tomorrow.');
    }
    globalEmailLimiter.resetDailyCountIfNeeded();
    
    try {
        const transporter = nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587, 
            secure: false, 
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: EMAIL_HOST,
            to: email,
            subject: subject,
            html: message
        });
        console.log('E-mail sent successfully');

        globalEmailLimiter.dailyTotal++;
    }
    catch (error) {
        console.log(`Failed to send e-mail: ${error}`);
        return error;
    }
}

export default sendEmail;