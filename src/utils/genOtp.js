import otpGenerator from "otp-generator"
export function generateOTP(params) {
    const otp=otpGenerator.generate(6,{upperCaseAlphabets:false,specialChars:false,lowerCaseAlphabets:false})
    return otp;
}