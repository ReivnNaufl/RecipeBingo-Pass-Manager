import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({  
    host: 'smtp.gmail.com', 
    port: 587, 
    secure: false,
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
});