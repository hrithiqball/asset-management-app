import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// export function htmlMagicLink(name: string, link: string): string {
//   return `<div>
//     <h1>Hi, ${name}!</h1>
//     <p>Welcome to Asset Management System!</p>
//     <p>Click <a href="${link}">here</a> to confirm your email</p>
//   </div>`;
// }

export function htmlForgotPassword(name: string, link: string): string {
  return `<div>
    <h1>Hi, ${name}!</h1>
    <p>Click <a href="${link}">here</a> to reset your password</p>
  </div>`;
}

export async function POST(nextRequest: NextRequest) {
  try {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587, // 465 for secure
      secure: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let message = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: 'bar@example.com, baz@example.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Successfully Register with us.', // plain text body
      html: '<b>Successfully Register with us.</b>', // html body
    };

    await transporter
      .sendMail(message)
      .then(info => {
        console.log('Message sent: ', info.messageId);
        console.log(nodemailer.getTestMessageUrl(info));
      })
      .catch(err => {
        console.error(err, 'lol noob');
      });

    return NextResponse.json(
      { message: 'Success: email was sent' },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Success: email was sent' },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
    // console.error(error);
  }
}
