<<<<<<< HEAD
import nodemailer from "nodemailer";
import {EMAIL,PASSWORD}from "../config/config.js"
// import {
//   UNAME,
//   PASSWORD,
//   CLIENTID,
//   CLIENTSECRET,
//   REFRESHTOKEN,
// } from "../config/config.js";
=======
import nodemailer from "nodemailer"
import { EMAIL,PASSWORD } from "../config/config.js"
>>>>>>> pradip

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

<<<<<<< HEAD
const smtpConfig = {
  EMAIL:EMAIL,
  PASSWORD:PASSWORD,
  HOST: "smtp.gmail.com",
  PORT: 587,
  FROM_EMAIL: EMAIL,
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
=======
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
    EMAIL:EMAIL,
    PASSWORD:PASSWORD,
    HOST: "smtp.gmail.com",
    PORT: 587,
    FROM_EMAIL: EMAIL,
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
>>>>>>> pradip
