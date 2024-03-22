import { FeedBackModel } from "../model/feedback.model.js";
import { Message } from "../config/message.js";

const { feedbackMessage, errorMessage } = Message;

export const addFeedBack = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "ADMIN") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.AdminCantSend });
    }

    const { name, email, rating, message } = req.body;

    if ((name && email && rating && message) === undefined) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.NotEnterValidFeilds });
    }

    if (user.email !== email) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }

    const findFeedback=await FeedBackModel.findOne({email:email})
    if(findFeedback)
    {
      return res
      .status(400)
      .json({ success: false, message: errorMessage.findFeedback });
  }
    

    const feedback = new FeedBackModel({ name, email, rating, message });
    await feedback.save();

    return res.status(200).json({
      success: true,
      data: feedback,
      message: feedbackMessage.SubmitFeedback,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getFeedBack = async (req, res) => {
  try {
    const admin = req.user;
    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSee });
    }

    const feedbackList = await FeedBackModel.find();
    return res.status(200).json({ data: feedbackList });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};
