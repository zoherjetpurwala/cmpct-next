import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'ins2.fleshdns.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'support@cmpct.in',
      pass: process.env.SMTP_PASSWORD, // Your email account password
    },
    tls: {
      // Optional: Add these if you encounter certificate issues
      rejectUnauthorized: false,
    }
  });
  
  // Verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.error('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to take our messages');
    }
  });
  
  export { transporter };