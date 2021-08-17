/*jshint esversion: 8*/
const nodemailer = require('nodemailer');

class email {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 8000,
            secure: false,
            auth: {
                user: 'correo@mail.com',
                pass: 'pass'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    sendEmail(email) {
        let mailOptions = {
            ...this.mailOptions,
            ...email
        };
        this.transport.sendMail(mailOptions, (error) => {
            if (error) {
                return console.log(error);
            }
        });
    }
}

module.exports = new email();
