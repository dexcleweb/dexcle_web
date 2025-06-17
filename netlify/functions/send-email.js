const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  const { name, email, subject, message } = JSON.parse(event.body || '{}');

  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'All fields are required' }),
    };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // Your Gmail or app email
      pass: process.env.EMAIL_PASS,     // App password or OAuth token
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `[Contact] ${subject}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent successfully!' }),
    };
  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to send email.' }),
    };
  }
};
