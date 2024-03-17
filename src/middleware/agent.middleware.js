import { verifyToken } from "../utils/genToken.js";
import { JWT_SECRET_KEY } from "../config/config.js";
import { AgentModel } from "../model/agent.model.js";
import { Message } from "../config/message.js";

const { errorMessage } = Message;

export const verifyAgent = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ sucess: false, message: errorMessage.UnauthorizedRequest });
    }

    const decodeToken = verifyToken(token, JWT_SECRET_KEY);
    console.log(decodeToken);

    const agent = await AgentModel.findById(decodeToken?.id).select(
      "-password"
    );

    if (!agent) {
      return res
        .status(401)
        .json({ sucess: false, message: errorMessage.InvalidUserToken });
    }

    req.user = agent;

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
