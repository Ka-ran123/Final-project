import { AgentModel } from "../model/agent.model.js";
import { UserModel } from "../model/user.model.js";
import { generateToken } from "../utils/genToken.js";
import { publicUrl } from "../utils/profilepic.js";
import { transporter, sendEmail } from "../utils/nodemailer.js";
import { fileUploadInCloudinary } from "../utils/clodinary.js";

import { Message } from "../config/message.js";
const { agentMessage, errorMessage, emailMessage } = Message;

export const addAgent = async (req, res) => {
  try {
    const data = req.body;

    if (
      (data.name && data.email && data.mobileNo && data.password) === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.NotEnterValidFeilds });
    }

    const findAgent = await AgentModel.findOne({ email: data.email });

    if (findAgent) {
      return res.status(401).json({ message: errorMessage.AgentAlreadyExits });
    }

    const nameFirstLetter = data.name.toLowerCase().slice(0, 1);
    const url = publicUrl(nameFirstLetter);

    const aadharCardImage = [];
    for (let i = 0; i < req.files["aadharCardPic"].length; i++) {
      let result = await fileUploadInCloudinary(
        req.files["aadharCardPic"][i].path
      );
      aadharCardImage.push(result.secure_url);
    }

    const panCardImage = [];
    for (let i = 0; i < req.files["panCardPic"].length; i++) {
      let result = await fileUploadInCloudinary(
        req.files["panCardPic"][i].path
      );
      panCardImage.push(result.secure_url);
    }

    data.aadharCardPic = aadharCardImage;
    data.panCardPic = panCardImage;

    const agent = new AgentModel({ ...data, profilePic: url });
    await agent.save();

    const token = generateToken({ id: agent._id });

    const emailTemp = `
        <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
  <tr>
  <td align="center">
      <table width="600" cellpadding="0" cellspacing="0">
          <tr>
              <td>
                  <div style="padding: 20px; background-color: white; text-align: center;">
                  <img src="https://media.istockphoto.com/id/1472307744/photo/clipboard-and-pencil-on-blue-background-notepad-icon-clipboard-task-management-todo-check.webp?b=1&s=170667a&w=0&k=20&c=WfRoNKWq5Dr-23RuNifv1kbIR1LVuZAsCzzSH2I3HsY=" alt="Logo" width="200" height="100" style="display: block; margin: 0 auto;">
                      <h1>Welcome to Our Service!</h1>
                      <p>Dear ${agent.name},</p>
                      <p>Thank you for registering with Our app.</p>
                      <p>Your account details:</p>
                      
                      <strong>Agentname:</strong> ${agent.name}<br>
                      <strong>Email:</strong> ${agent.email}
                      
                      <p>We're excited to have you on board to out team.</p>
                      <p>Our Team will conduct one meeting within 24 hours so pleace connect into our meeting and this meeting link will be provide in your email.💌</p>
                      <p>If you have any questions or need assistance, please don't hesitate to contact our support team at karanunagar123@gmail.com.</p>
                      <p>Best regards,</p>
                      <p>Home-Hub Market</p>
                  </div>
              </td>
          </tr>
      </table>
  </td>
  </tr>
  </table>
  
  `;

    const mailOptions = {
      to: agent.email,
      subject: emailMessage.SignupSubject,
      html: emailTemp,
    };

    await sendEmail(mailOptions);

    return res.status(201).json({
      success: true,
      agent,
      token: token,
      message: agentMessage.AddAgent,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getAllAgent = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }

    const allAgent = await AgentModel.find();
    if (!allAgent) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.InvalidData });
    }

    return res.status(200).json({
      success: true,
      allAgent,
      message: agentMessage.GetAllAgent,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const agentMetting = async (req, res) => {
  try {
    const { email, date, time, name, link } = req.body;

    if ((email && date && time && name && link) == undefined) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.NotEnterValidFeilds });
    }

    const mailFormat = `
          <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
              <tr>
                  <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0">
                          <tr>
                              <td>
                                  <div style="padding: 20px; background-color: #ffffff; text-align: center;">
                                  <img src="https://media.istockphoto.com/id/1280210882/vector/vector-of-a-businesspeople-sitting-at-table-brainstorming.jpg?s=612x612&w=0&k=20&c=lVF0QbHutKRscOb0Szj0Es_BT4GUqnabigEd9uo6ZKI=" alt="OTP Image" width="250" height="170" style="display: block; margin: 0 auto;">
                                  <h2>Invitation to Google Meet Meeting</h2>
                                  <p>Dear ${name},</p>
                                  <p>I hope this email finds you well. I would like to invite you to a meeting via Google Meet:</p>
                                  <ul>
                                    <li><strong>Meeting Title:</strong>💫Discussion with our team💫</li>
                                    <li><strong>Date:</strong> ${date}</li>
                                    <li><strong>Time:</strong> ${time}</li>
                                    <li><strong>Meeting Link:</strong><a href="${link}">💥Join Our Meeting💥</a></li>
                                  </ul>
                                  <p>Please let me know if the proposed date and time work for you. If not, feel free to suggest an alternative time.</p>
                                  <p>Looking forward to our discussion!</p>
                                  <p>Best regards,</p>
                                  <p>Home-Hub Market</p>
                                  </div>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              </table>
          `;

    const mailOptions = {
      to: email,
      subject: "Home-Hub Market",
      html: mailFormat,
    };

    await sendEmail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: agentMessage.AgentMetting });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const mailFormat = `
                  <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
                  <tr>
                      <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0">
                              <tr>
                                  <td>
                                      <div style="padding: 20px; background-color: white; text-align: center; color: white;">
                                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ_IHiDuvXTtUevOvzGFNbDfWwlGSNTqXYQ&usqp=CAU" alt="verify agent" width="250" height="170" style="display: block; margin: 0 auto;">
                                          <h1>**Verification**</h1>
                                          <p>Hello there!</p>
                                          <p>If you want to become an agent, click on the link below and fill up the form..</p>
                                          <a href="${`https://homehubmarket-b65c6.web.app/agent/`}">💥Click this link to fill form💥</a>
                                          <p>Best regards</p>
                                          <p>Home-Hub Market</p>
                                         
                                      </div>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  </table>
                  `;

    const mailOptions = {
      to: email,
      subject: "Home-Hub Market",
      html: mailFormat,
    };

    await sendEmail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: agentMessage.AgentMetting });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const totalAgentCount = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSeeTotal });
    }

    const agents = await AgentModel.find().count();
    if (!agents) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.AgentNotFound });
    }

    return res.status(200).json({
      success: true,
      agents,
      message: agentMessage.TotalAgent,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const totalAgent = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSee });
    }

    const agents = await AgentModel.find();
    if (!agents) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.AgentNotFound });
    }

    return res.status(200).json({
      success: true,
      agents,
      message: agentMessage.TotalAgent,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};
