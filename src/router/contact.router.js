import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { addQuery,getQuery } from "../controller/contact.controller.js";

const router = Router();

router.post('/add-userquery' , verifyUser ,addQuery )
router.get('/get-userqueries' , verifyUser ,getQuery )

export const contactRouter = router;
