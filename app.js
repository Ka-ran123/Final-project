import express from "express"
import { router } from "./src/router/router.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import {swaggerDocs} from "./swagger.js";


const app = express()
swaggerDocs(app);

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/api/v1',router)

export {app}