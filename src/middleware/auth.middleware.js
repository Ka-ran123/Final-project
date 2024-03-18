import { verifyToken } from "../utils/genToken.js";
import { JWT_SECRET_KEY } from "../config/config.js";
import { UserModel } from "../model/user.model.js";
import { Message } from "../config/message.js";

const { errorMessage } = Message;

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ sucess: false, message: errorMessage.UnauthorizedRequest });
    }
    // console.log(token);

    const decodeToken = verifyToken(token, JWT_SECRET_KEY);
    // console.log(decodeToken?.id);

    const user = await UserModel.findById(decodeToken?.id).select("-password");
    // console.log(user);

    if (!user) {
      return res
        .status(401)
        .json({ sucess: false, message: errorMessage.InvalidUserToken });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
