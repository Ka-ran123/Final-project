import nodemailer from "nodemailer";
// import {
//   UNAME,
//   PASSWORD,
//   CLIENTID,
//   CLIENTSECRET,
//   REFRESHTOKEN,
// } from "../config/config.js";

// export const transporter=nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//         type:'OAuth2',
//         user:UNAME,
//         pass:PASSWORD,
//         clientId:CLIENTID,
//         clientSecret:CLIENTSECRET,
//         refreshToken:REFRESHTOKEN,
//         expires:1494388182480
//     }
// })

const smtpConfig = {
  EMAIL: "homehubmarket123@gmail.com",
  PASSWORD: "qxod wqaj spoq tjav",
  HOST: "smtp.gmail.com",
  PORT: 587,
  FROM_EMAIL: "homehubmarket123@gmail.com",
};

export const transporter = nodemailer.createTransport(
  {
    host: smtpConfig.HOST,
    port: smtpConfig.PORT,
    secure: false,
    auth: {
      user: smtpConfig.EMAIL,
      pass: smtpConfig.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  { sendmail: true }
);

export async function sendEmail(mailOptions) {
  await transporter.verify(async (error) => {
    if (error) {
      return { error: error.message };
    }
  });
  const emailResponse = await transporter.sendMail(mailOptions);
  return { result: "Email sent successfully" };
}
