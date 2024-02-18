import { PropertyModel } from "../model/property.model.js";
import { UserModel } from "../model/user.model.js";
import {
  fileDestroyInCloudinary,
  fileUploadInCloudinary,
} from "../utils/clodinary.js";

const PropertyController = {
  addProperty: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user?._id);
      if (!user) {
        const response = {
          statusCode: 401,
          success: false,
          message: "Unauthorized User",
        };
        return res.status(200).json(response);
      }

      const data = req.body;

      if (user.email !== data.email && user.mobileNo !== data.mobileNo) {
        const response = {
          statusCode: 400,
          success: false,
          message: "Invalid Data",
        };
        return res.status(200).json(response);
      }

      if (req.files === undefined) {
        const response = {
          statusCode: 400,
          success: false,
          message: "Invalid Data",
        };
        return res.status(200).json(response);
      }

      const image = [];
      for (let i = 0; i < req.files.length; i++) {
        let result = await fileUploadInCloudinary(req.files[i].path);
        image.push(result.secure_url);
      }

      data.propertyImage = image;
      data.facility = data.facility.split(",");

      const propertyData = new PropertyModel({...data,userId:user._id});

      await propertyData.save();

      const response = {
        statusCode: 201,
        success: true,
        propertyData,
        message: "Property Add Successfully",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  getAllProperty: async (req, res) => {
    try {
        const user = await UserModel.findById(req.user?._id);
        if (!user) {
          const response = {
            statusCode: 401,
            success: false,
            message: "Unauthorized User",
          };
          return res.status(200).json(response);
        }

        if(user.role === 'USER')
        {
            const response = {
                statusCode: 400,
                success: false,
                message: "User Not Show Data",
              };
              return res.status(200).json(response);
        }

      const allProperty = await PropertyModel.find();
      if (!allProperty) {
        const response = {
          statusCode: 400,
          sucess: false,
          message: "Bad Request",
        };
        return res.status(200).json(response);
      }
      const response = {
        statusCode: 200,
        sucess: true,
        allProperty,
        message: "All Property Show",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  getUserAllProperty: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user?._id);
      if (!user) {
        const response = {
          statusCode: 401,
          success: false,
          message: "Unauthorized User",
        };
        return res.status(200).json(response);
      }

      const propertyData = await PropertyModel.find({userId:user._id});

      const response = {
        statusCode: 200,
        success: true,
        propertyData,
        message: "All Property",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  getUserPendingProperty:async (req,res)=>{
    try {
        const user = await UserModel.findById(req.user?._id);
        if (!user) {
          const response = {
            statusCode: 401,
            success: false,
            message: "Unauthorized User",
          };
          return res.status(200).json(response);
        }
  
        const propertyData = await PropertyModel.find({$and:[{userId:user._id},{status:'pending'}]});
  
        const response = {
          statusCode: 200,
          success: true,
          propertyData,
          message: "All Property",
        };
        return res.status(200).json(response);
      } catch (error) {
        const response = {
          statusCode: 501,
          sucess: false,
          message: error.message,
        };
        return res.status(200).json(response);
      }
  },
  getUserApprovalProperty:async (req,res)=>{
    try {
        const user = await UserModel.findById(req.user?._id);
        if (!user) {
          const response = {
            statusCode: 401,
            success: false,
            message: "Unauthorized User",
          };
          return res.status(200).json(response);
        }
  
        const propertyData = await PropertyModel.find({$and:[{userId:user._id},{status:'approval'}]});
        
        const response = {
          statusCode: 200,
          success: true,
          propertyData,
          message: "All Property",
        };
        return res.status(200).json(response);
      } catch (error) {
        const response = {
          statusCode: 501,
          sucess: false,
          message: error.message,
        };
        return res.status(200).json(response);
      }
  },
  getUserCancleProperty:async (req,res)=>{
    try {
        const user = await UserModel.findById(req.user?._id);
        if (!user) {
          const response = {
            statusCode: 401,
            success: false,
            message: "Unauthorized User",
          };
          return res.status(200).json(response);
        }
  
        const propertyData = await PropertyModel.find({$and:[{userId:user._id},{status:'cancle'}]});

        const response = {
          statusCode: 200,
          success: true,
          propertyData,
          message: "All Property",
        };
        return res.status(200).json(response);
      } catch (error) {
        const response = {
          statusCode: 501,
          sucess: false,
          message: error.message,
        };
        return res.status(200).json(response);
      }
  }
};

export { PropertyController };