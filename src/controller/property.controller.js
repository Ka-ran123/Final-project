import { PropertyModel } from "../model/property.model.js";
import { UserModel } from "../model/user.model.js";
import { AgentModel } from "../model/agent.model.js";
import { fileUploadInCloudinary } from "../utils/clodinary.js";
import { Message } from "../config/message.js";

const { propertyMessage, errorMessage } = Message;

export const addProperty = async (req, res) => {
  try {
    const user = req.user;

    const data = req.body;

    if (user.email !== data.email && user.mobileNo !== data.mobileNo) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.InvalidData });
    }

    if (req.files === undefined) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.InvalidData });
    }

    const image = [];
    for (let i = 0; i < req.files.length; i++) {
      let result = await fileUploadInCloudinary(req.files[i].path);
      image.push(result.secure_url);
    }

    const userCity = data.city;

    const findAgent = await AgentModel.findOne({ city: userCity });

    let agentId;
    if (!findAgent) {
      const findAgent = await AgentModel.find().sort({ date: -1 });
      let num = Math.floor((Math.random() * 10) / 2) + 1;
      // console.log(num);
      agentId = findAgent[num]._id;
    } else {
      agentId = findAgent._id;
    }

    // console.log(agentId);
    data.propertyImage = image;
    data.facility = data.facility.split(",");

    const propertyData = new PropertyModel({
      ...data,
      userId: user._id,
      agentId,
    });

    await propertyData.save();

    return res.status(201).json({
      success: true,
      propertyData,
      message: propertyMessage.AddProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getAllProperty = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }
    const allProperty = await PropertyModel.find();
    if (!allProperty) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }
    return res.status(200).json({
      success: true,
      allProperty,
      message: propertyMessage.GetAllProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getAllSelectedProperty = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }
    const status = req.params.key;
    let allProperty;
    if(status == "All"){
      allProperty = await PropertyModel.find();
    }
    else if(status == "Rejected")
    {
      allProperty = await PropertyModel.find({status:"cancel"});
    }
    else if(status == "Pending"){
      allProperty = await PropertyModel.find({status:"pending"});
    }
    else if(status == "Approved"){
      allProperty = await PropertyModel.find({status:"approval"});
    }
    

    if (!allProperty) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }
    return res.status(200).json({
      success: true,
      allProperty,
      message: propertyMessage.GetAllProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getUserAllProperty = async (req, res) => {
  try {
    const user = req.user;

    const propertyData = await PropertyModel.find({ userId: user._id });

    return res.status(200).json({
      success: true,
      propertyData,
      message: propertyMessage.GetUserAllProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getUserPendingProperty = async (req, res) => {
  try {
    const user = req.user;

    const propertyData = await PropertyModel.find({
      $and: [{ userId: user._id }, { status: "pending" }],
    });

    return res.status(200).json({
      success: true,
      propertyData,
      message: propertyMessage.GetUserPendingProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getUserApprovalProperty = async (req, res) => {
  try {
    const user = req.user;

    const propertyData = await PropertyModel.find({
      $and: [{ userId: user._id }, { status: "approval" }],
    });

    return res.status(200).json({
      success: true,
      propertyData,
      message: propertyMessage.GetUserApprovalProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getUserCancleProperty = async (req, res) => {
  try {
    const user = req.user;

    const propertyData = await PropertyModel.find({
      $and: [{ userId: user._id }, { status: "cancel" }],
    });

    return res.status(200).json({
      success: true,
      propertyData,
      message: propertyMessage.GetUserCancelProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getAllPropertyForApp = async (_, res) => {
  try {
    const allProperty = await PropertyModel.find();
    if (!allProperty) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }
    return res.status(200).json({
      success: true,
      allProperty,
      message: propertyMessage.GetAllProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getOnlySellProperty = async (req, res) => {
  try {
    const allProperty = await PropertyModel.find({
      $and: [{ type: { $eq: "Sell" }, status: { $eq: "approval" } }],
    });

    return res.status(200).json({
      success: true,
      allProperty,
      message: propertyMessage.GetOnlySellProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getOnlyRentProperty = async (req, res) => {
  try {
    const allProperty = await PropertyModel.find({
      $and: [{ type: { $eq: "Rent" }, status: { $eq: "approval" } }],
    });

    return res.status(200).json({
      success: true,
      allProperty,
      message: propertyMessage.GetOnlyRentProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const setApproveProperty = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantChange });
    }

    const data = req.body.id;

    const property = await PropertyModel.findById(data);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.PropertyNotFound });
    }

    property.status = "approval";
    await property.save();

    return res.status(200).json({
      success: true,
      property,
      message: propertyMessage.SetApproveProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const setCancelProperty = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantChange });
    }

    const data = req.body.id;

    const property = await PropertyModel.findById(data);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.PropertyNotFound });
    }

    property.status = "cancel";
    await property.save();

    return res.status(200).json({
      success: true,
      property,
      message: propertyMessage.SetCancelProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const totalPropertyCount = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSeeTotal });
    }

    const property = await PropertyModel.find({status:"approval"}).count();
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.PropertyNotFound });
    }

    return res.status(200).json({
      success: true,
      property,
      message: propertyMessage.TotalProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const totalRentPropertyCount = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSeeTotal });
    }

    const property = await PropertyModel.find({
      $and: [{ type: { $eq: "Rent" }, status: { $eq: "approval" } }],
    }).count();
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.PropertyNotFound });
    }

    return res.status(200).json({
      success: true,
      property,
      message: propertyMessage.TotalRentProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const totalSellPropertyCount = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSeeTotal });
    }

    const property = await PropertyModel.find({
      $and: [{ type: { $eq: "Sell" }, status: { $eq: "approval" } }],
    }).count();
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.PropertyNotFound });
    }

    return res.status(200).json({
      success: true,
      property,
      message: propertyMessage.TotalSellProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getAllPropertyForAdmin = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSee });
    }

    const allProperty = await PropertyModel.find({status:"approval"});
    if (!allProperty) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }
    return res.status(200).json({
      success: true,
      allProperty,
      message: propertyMessage.GetAllProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getOnlySellPropertyForAdmin = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSee });
    }

    const allProperty = await PropertyModel.find({
      $and: [{ type: { $eq: "Sell" }, status: { $eq: "approval" } }],
    });

    return res.status(200).json({
      success: true,
      allProperty,
      message: propertyMessage.GetOnlySellProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getOnlyRentPropertyForAdmin = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSee });
    }

    const allProperty = await PropertyModel.find({
      $and: [{ type: { $eq: "Rent" }, status: { $eq: "approval" } }],
    });

    return res.status(200).json({
      success: true,
      allProperty,
      message: propertyMessage.GetOnlyRentProperty,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};