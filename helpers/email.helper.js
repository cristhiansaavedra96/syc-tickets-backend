import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (emailTo, subject, body) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: emailTo,
            subject: subject,
            text: body
        });
    } catch (error) {
        console.log(error);
    }
};

export default sendEmail;
