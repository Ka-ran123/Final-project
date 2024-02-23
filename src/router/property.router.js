import { Router } from "express";
import { PropertyController } from "../controller/property.controller.js";

import { verifyUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router()

router.post('/add-property' , verifyUser ,upload.array('propertyImage',10), PropertyController.addProperty)
router.get('/getall-property' , verifyUser, PropertyController.getAllProperty)
router.get('/getuserall-property' , verifyUser, PropertyController.getUserAllProperty)
router.get('/getuserpending-property' , verifyUser, PropertyController.getUserPendingProperty)
router.get('/getuserapproval-property' , verifyUser, PropertyController.getUserApprovalProperty)
router.get('/getusercancel-property' , verifyUser, PropertyController.getUserCancelProperty)

export const propertyRouter = router