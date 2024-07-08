import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const sendEmailService = async ({
    to = '', // 'email1' , 'email1,email2,email3'
    subject = 'no-reply',
    message = '<h1>no-message</h1>',
    attachments = []
}) => {
    try {
        // email configuration
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Use Gmail SMTP server
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.error('Error verifying transporter configuration:', error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });

        const info = await transporter.sendMail({
            from: `"Fred Foo 👻" <${process.env.EMAIL}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html: message, // html body,
            attachments
        });

        console.log(`Email sent: ${info.response}`);
        return info.accepted.length ? true : false;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export default sendEmailService;
