import { verifyToken } from "../utils/genToken.js";
import { JWT_SECRET_KEY } from "../config/config.js";
import { UserModel } from "../model/user.model.js";

export const verifyUser = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    // console.log(req.headers);
    const token =
      req.cookies?.Token || req.headers["authorization"]?.split(" ")[1];
    // console.log(token);
    if (!token) {
      const response = {
        statusCode: 401,
        sucess: false,
        message: "Unauthorized request",
      };
      return res.status(200).json(response);
    }

    const decodeToken = verifyToken(token, JWT_SECRET_KEY);
    // console.log(decodeToken);

    const user = await UserModel.findById(decodeToken?.id).select("-password");
    // console.log(user);

    if (!user) {
      const response = {
        statusCode: 401,
        sucess: false,
        message: "Invalid Access Token",
      };
      return res.status(200).json(response);
    }

    req.user = user;
    // console.log(req.user);
    next();
  } catch (error) {
    const response = {
      statusCode: 500,
      sucess: false,
      message: "Server Error",
    };
    return res.status(200).json(response);
  }
};
