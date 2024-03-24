import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  addProperty,
  getAllProperty,
  setApproveProperty,
  setCancelProperty,
  getAllPropertyForApp,
  getOnlySellProperty,
  getOnlyRentProperty,
  getAllSelectedProperty,
  getAllSelectedPropertyUser,
  getUserAllProperty,
  getUserApprovalProperty,
  getUserCancleProperty,
  getUserPendingProperty
} from "../controller/property.controller.js";

const router = Router();

router.post(
  "/add-property",
  verifyUser,
  upload.array("propertyImage", 10),
  addProperty
);
router.get("/getall-property", verifyUser, getAllProperty);
router.get("/getuserall-property", verifyUser, getUserAllProperty);
router.get("/getuserpending-property", verifyUser, getUserPendingProperty);
router.get("/getuserapproval-property", verifyUser, getUserApprovalProperty);
router.get("/getusercancel-property", verifyUser, getUserCancleProperty);
router.post("/set-approveproperty", verifyUser, setApproveProperty);
router.post("/set-cancelproperty", verifyUser, setCancelProperty);

router.get("/getall-property", getAllPropertyForApp);
router.get("/getall-sellproperty", getOnlySellProperty);
router.get("/getall-rentproperty", getOnlyRentProperty);

router.get("/get-selected-property/:key", verifyUser, getAllSelectedProperty);
router.get("/get-selected-property-user/:key", verifyUser, getAllSelectedPropertyUser);

export const propertyRouter = router;
