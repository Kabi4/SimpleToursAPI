const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
    const transpoter = nodemailer.createTransport({
        //service: "Gmail",
        host: process.env.EMAIL__HOST,
        port: process.env.EMAIL__PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'Kushagra Singh <mymail@kushag.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transpoter.sendMail(mailOptions);
};

module.exports = sendEmail;
