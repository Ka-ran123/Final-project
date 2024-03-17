import mongoose,{Schema} from "mongoose";
import validator from "validator";

const otpSchema=new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Validation Error");
          }
        },
      },
      otp:{
        type:String,
        trim: true
      }
})

const OtpModel = mongoose.model("otp", otpSchema);

export { OtpModel};