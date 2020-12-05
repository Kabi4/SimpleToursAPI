const nodemailer = require('nodemailer');
const pug = require('pug');
const htmltostring = require('html-to-text');

exports.Email = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.name.split(' ')[0];
        this.from = `${process.env.EMAIL__NAME}${' '}<${
            process.env.EMAIL__FROM
        }>`;
        this.url = url;
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return 1;
        } else {
            return nodemailer.createTransport({
                //service: "Gmail",
                host: process.env.EMAIL__HOST,
                port: process.env.EMAIL__PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
    }
    async send(template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../Views/email/${template}.pug`,
            {
                firstName: this.name,
                url: this.url,
                subject,
            }
        );
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: htmltostring.fromString(html),
        };
        await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send(
            'welcome',
            'Welcome to Natours lets explore the world!'
        );
    }
};
