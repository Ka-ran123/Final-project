import express from "express"
import { router } from "./src/router/router.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/api/v1',router)

export {app}