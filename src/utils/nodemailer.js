import nodemailer from "nodemailer"
import { UNAME,PASSWORD,CLIENTID,CLIENTSECRET,REFRESHTOKEN } from "../config/config.js"


export const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user:UNAME,
        pass:PASSWORD,
        clientId:CLIENTID,
        clientSecret:CLIENTSECRET,
        refreshToken:REFRESHTOKEN,
        expires:1494388182480
    }
})