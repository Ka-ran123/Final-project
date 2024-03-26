import { contactModel } from "../model/contact.model.js";
import { Message } from "../config/message.js";

const { ContactMessage, errorMessage } = Message;

export const addQuery = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "ADMIN") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.AdminCantSend });
    }

    const { name, email, subject, message } = req.body;

    if ((name && email && subject && message) === undefined) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.NotEnterValidFeilds });
    }

    if (user.email !== email) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }

    const findContact = await contactModel.findOne({ email: email });
    if (findContact) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.findContact });
    }

    const userQuery = new contactModel({
      name,
      email,
      subject,
      message,
    });
    await userQuery.save();

    return res.status(200).json({
      success: true,
      data: userQuery,
      message: ContactMessage.SubmitContact,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getQuery = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "ADMIN") {
      const queryList = await contactModel.find();
      return res.status(200).json({ data: queryList });
    }
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};
