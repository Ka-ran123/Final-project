import dotenv from "dotenv";
dotenv.config()

export const PORT = process.env.PORT
export const DB_ATLAS=process.env.DB_ATLAS
export const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY
export const UNAME=process.env.UNAME
export const PASSWORD=process.env.PASSWORD
export const CLIENTID=process.env.CLIENTID
export const CLIENTSECRET=process.env.CLIENTSECRET
export const REFRESHTOKEN=process.env.REFRESHTOKEN