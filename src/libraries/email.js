import nodemailer from 'nodemailer';

let transport = nodemailer.createTransport({
  service: 'gmail',
  port: 8000,
  secure: false,
  auth: {
    user: 'correo@mail.com',
    pass: 'pass',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default function sendEmail(email) {
  let mailOptions = {
    ...this.mailOptions,
    ...email,
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      return console.log(error);
    }
  });
}
