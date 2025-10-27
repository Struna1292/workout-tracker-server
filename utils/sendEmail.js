import nodemailer from 'nodemailer';

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const sendEmail = async (email, subject, message) => {
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
    }
    catch (error) {
        console.log(`Failed to send e-mail: ${error}`);
        return error;
    }
}

export default sendEmail;