const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "Test Email <test@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: `<p>${options.message}</p>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
