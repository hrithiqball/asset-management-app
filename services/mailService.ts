import nodemailer from 'nodemailer';

export async function sendMail(
  subject: string,
  toEmail: string,
  otpText: string,
) {
  const mail = 'mishu.asset.management@gmail.com';
  const pass = '@sseT777';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: mail,
    to: toEmail,
    subject,
    text: otpText,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      throw new Error(error.message);
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  });
}
