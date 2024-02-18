import { Router } from "express";
import { userRouter } from "./user.router.js";
import { propertyRouter } from "./property.router.js";

const router = Router();

router.use('/auth',userRouter);
router.use('/property' ,propertyRouter)

export {router}