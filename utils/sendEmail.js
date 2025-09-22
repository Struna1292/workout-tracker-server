import nodemailer from 'nodemailer';

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_HOST,
                pass: EMAIL_PASSWORD,
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