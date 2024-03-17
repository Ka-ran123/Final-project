import jwt from "jsonwebtoken"
import { JWT_SECRET_KEY } from "../config/config.js"


export function generateToken(data) {
    return jwt.sign(data,JWT_SECRET_KEY,{expiresIn: '7d'})    
}

export function verifyToken(token)
{
    return jwt.verify(token,JWT_SECRET_KEY)
}