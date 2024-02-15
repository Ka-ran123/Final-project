import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import { CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET } from "../config/config.js";


cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret:  CLOUDINARY_API_SECRET
});


const fileUploadInCloudinary = async (localfilepath)=>{
    try {
        if(!localfilepath) return null
        const response=cloudinary.uploader.upload(localfilepath , {
          resource_type: "auto"   //it's for what we upload like video,image etc
        });
        console.log(response);
        fs.unlinkSync(localfilepath)   //upload successfully when remove file from locally
        return response;
    } catch (error) {     
      fs.unlinkSync(localfilepath)  //remove the file from locally saved temporary file
      return null;
    }
}

export {fileUploadInCloudinary}