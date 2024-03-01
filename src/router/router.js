import { Router } from "express";
import { userRouter } from "./user.router.js";
import { propertyRouter } from "./property.router.js";
import { agentRouter } from "./agent.router.js"

const router = Router();

router.use('/auth',userRouter);
router.use('/property' ,propertyRouter)
router.use('/agent' ,agentRouter)


export {router}