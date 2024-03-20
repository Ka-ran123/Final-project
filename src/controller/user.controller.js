import { UserModel } from "../model/user.model.js";
import { AgentModel } from "../model/agent.model.js";
import { generateToken } from "../utils/genToken.js";
import { transporter, sendEmail } from "../utils/nodemailer.js";
import { generateOTP } from "../utils/genOtp.js";
import { OtpModel } from "../model/otp.model.js";
import { publicUrl } from "../utils/profilepic.js";
import {
  fileDestroyInCloudinary,
  fileUploadInCloudinary,
} from "../utils/clodinary.js";
import { Message } from "../config/message.js";
import { OAuth2Client } from "google-auth-library";
const  client = new OAuth2Client(process.env.CLIENTID)

const { userMessage, errorMessage, emailMessage } = Message;

export const signUp = async (req, res) => {
  try {
    const { name, email, mobileNo, password, role } = req.body;

    if ((name && email && mobileNo && password) === undefined) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.NotEnterValidFeilds });
    }

    if (role === "ADMIN") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.SelectValidRole });
    }

    const findUser = await UserModel.findOne({ email });

    if (findUser) {
      return res
        .status(409)
        .json({ success: false, message: errorMessage.UserAlreadyExits });
    }

    const nameFirstLetter = name.toLowerCase().slice(0, 1);
    const url = publicUrl(nameFirstLetter);

    const user = new UserModel({
      name,
      email,
      mobileNo,
      password,
      profilePic: url,
    });
    await user.save();

    const token = generateToken({ id: user._id });

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
                  <p>Dear ${user.name},</p>
                  <p>Thank you for registering with Our app. You're now a part of our community.</p>
                  <p>Your account details:</p>
                  
                  <strong>Username:</strong> ${user.name}<br>
                  <strong>Email:</strong> ${user.email}
                  
                  <p>We're excited to have you on board, and you can start using our service right away.</p>
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
      to: user.email,
      subject: emailMessage.SignupSubject,
      html: emailTemp,
    };

    await sendEmail(mailOptions);

    const userData = user.getData();
    return res.status(201).json({
      success: true,
      User: userData,
      token: token,
      message: userMessage.SignUp,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ((email && password) === undefined) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.NotEnterValidFeilds });
    }

    const findUser = await UserModel.findOne({ email: email, role: "USER" });

    const findAdmin = await UserModel.findOne({
      email: email,
      role: "ADMIN",
    });

    const findAgent = await AgentModel.findOne({
      email: email,
      role: "AGENT",
    });

    if (!findUser && !findAdmin && !findAgent) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.UserNotExits });
    }

    let matchUserPasssword;
    let matchAgentPasssword;
    let matchAdminPasssword;
    if (findUser) {
      matchUserPasssword = await findUser.isPasswordCorrect(password);
    } else if (findAgent) {
      matchAgentPasssword = await findAgent.isPasswordCorrect(password);
    } else {
      matchAdminPasssword = await findAdmin.isPasswordCorrect(password);
    }

    if (!matchUserPasssword && !matchAdminPasssword && !matchAgentPasssword) {
      return res
        .status(401)
        .json({ success: false, message: errorMessage.InvalidCredentials });
    }

  
    if (findUser) {
      const user = await UserModel.findById(findUser._id).select(
        "-password -publicUrl"
      );
      const userToken = generateToken({ id: findUser._id });

      return res.status(200).json({
        success: true,
        user,
        token: userToken,
        message: userMessage.SignInUser,
      });
    } else if (findAgent) {
      const agent = await AgentModel.findById(findAgent._id).select(
        "-password -publicUrl"
      );
      const agentToken = generateToken({ id: findAgent._id });

      return res.status(200).json({
        success: true,
        agent,
        token: agentToken,
        message: userMessage.SignInAgent,
      });
    } else {
      const admin = await UserModel.findById(findAdmin._id).select(
        "-password -publicUrl"
      );
      const adminToken = generateToken({ id: findAdmin._id });

      return res.status(200).json({
        success: true,
        admin,
        token: adminToken,
        message: userMessage.SignInAdmin,
      });
    }
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();

    const mailFormat = `
              <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
              <tr>
                  <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0">
                          <tr>
                              <td>
                                  <div style="padding: 20px; background-color: #ffffff; text-align: center;">
                                  <img src="https://media.istockphoto.com/id/1300422159/photo/woman-hand-enter-a-one-time-password-for-the-validation-process-mobile-otp-secure.webp?b=1&s=170667a&w=0&k=20&c=eADS7XcHTFs4kNItYwelOtHYFVbl0RWpSuXJgjFjai4=" alt="OTP Image" width="200" height="200" style="display: block; margin: 0 auto;">
                                      <h1>One-Time Password OTP Verification</h1>
                                      <p>Hello there!</p>
                                      <p>Your OTP code is: <strong style="font-size: 24px;">${otp}</strong></p>
                                      <p>This OTP will expire in 1 minutes.</p>
                                      <p>If you didn't request this OTP, please ignore this email.</p>
                                      <P>Don't share your otp with someone else.</p>
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
      subject: emailMessage.VerifyEmailSubject,
      html: mailFormat,
    };

    await sendEmail(mailOptions);
    await OtpModel.findOneAndDelete({ email });
    const userOtp = new OtpModel({ email: email, otp: otp });
    await userOtp.save();

    setTimeout(async () => {
      await OtpModel.findOneAndDelete({ email: email });
    }, 1000 * 60);

    return res
      .status(200)
      .json({ success: true, message: userMessage.VerifyEmail });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const findUser = await OtpModel.findOne({ email });

    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.UserNotExits });
    }

    if (findUser.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.OtpWrong });
    }

    await OtpModel.findOneAndDelete({ email: findUser.email });

    return res
      .status(200)
      .json({ success: true, message: userMessage.VerifyOtp });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: userMessage.UserNotExits });
    }

    const otp = generateOTP();

    const mailFormat = `
      <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
      <tr>
          <td align="center">
              <table width="600" cellpadding="0" cellspacing="0">
                  <tr>
                      <td>
                          <div style="padding: 20px; background-color: #ffffff; text-align: center;">
                          <img src="https://media.istockphoto.com/id/1300422159/photo/woman-hand-enter-a-one-time-password-for-the-validation-process-mobile-otp-secure.webp?b=1&s=170667a&w=0&k=20&c=eADS7XcHTFs4kNItYwelOtHYFVbl0RWpSuXJgjFjai4=" alt="OTP Image" width="200" height="200" style="display: block; margin: 0 auto;">
                              <h1>One-Time Password OTP Verification</h1>
                              <p>Hello there!</p>
                              <p>Your OTP code is: <strong style="font-size: 24px;">${otp}</strong></p>
                              <p>This OTP will expire in 1 minutes.</p>
                              <p>If you didn't request this OTP, please ignore this email.</p>
                              <P>Don't share your otp with someone else.</p>
                          </div>
                      </td>
                  </tr>
              </table>
          </td>
      </tr>
      </table>
      `;

    const mailOptions = {
      to: findUser.email,
      subject: emailMessage.ForgotPasswordSubject,
      html: mailFormat,
    };

    await sendEmail(mailOptions);
    await OtpModel.findOneAndDelete({ email: findUser.email });
    const user = new OtpModel({ email: findUser.email, otp: otp });
    await user.save();

    setTimeout(async () => {
      await OtpModel.findOneAndDelete({ email: findUser.email });
    }, 1000 * 60);

    return res
      .status(200)
      .json({ success: true, message: userMessage.ForgotPassword });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.UserNotExits });
    }

    findUser.password = newPassword;
    await findUser.save();

    return res
      .status(200)
      .json({ sucess: true, message: userMessage.ResetPassword });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(req.user?._id);

    const matchPasssword = await user.isPasswordCorrect(oldPassword);

    if (!matchPasssword) {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.PasswordWrong });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false }); //validation check ny kre

    return res
      .status(200)
      .json({ success: true, message: userMessage.ChangePassword });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      userData: req.user,
      message: userMessage.GetCurrentUser,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const changeProfilePic = async (req, res) => {
  try {
    const user = req.user;

    const profilePicLocalPath = req.file?.path;
    console.log(profilePicLocalPath);

    if (!profilePicLocalPath) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.ProfilePicNotFound });
    }

    if (user.publicUrl !== null) {
      await fileDestroyInCloudinary(user.publicUrl);
    }

    const profilePicInCloudinary = await fileUploadInCloudinary(
      profilePicLocalPath
    );

    user.profilePic = profilePicInCloudinary.secure_url;
    user.publicUrl = profilePicInCloudinary.public_id;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: userMessage.ChangeProfilePic });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const deleteProfilePic = async (req, res) => {
  try {
    const user = req.user;

    await fileDestroyInCloudinary(user.publicUrl);

    const nameFirstLetter = user.name.toLowerCase().slice(0, 1);
    const url = publicUrl(nameFirstLetter);
    user.profilePic = url;
    user.publicUrl = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: userMessage.DeleteProfilePic });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const googleLoginUser = async (req, res) => {
  try {
    const token = req.body.token;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENTID,
    });
    let payload = ticket.getPayload();
    const findUser = await UserModel.findOne({ email: payload.email });
    if (findUser) {
      const userToken = generateToken({ id: findUser._id });
      return res.status(200).json({
        success: true,
        userData: findUser.getData(),
        token: userToken,
        message: userMessage.SignInUser,
      });
    }
    const result = await fileUploadInCloudinary(payload.picture);
    const newUser = new UserModel({
      name: payload.name,
      email: payload.email,
      profilePic: result.secure_url,
      publicUrl: result.public_id,
      isLogin: true,
    });
    await newUser.save();
    const userToken = generateToken({ id: newUser._id });
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
                        <p>Dear ${newUser.name},</p>
                        <p>Thank you for registering with Our app. You're now a part of our community.</p>
                        <p>Your account details:</p>
                        
                        <strong>Username:</strong> ${newUser.name}<br>
                        <strong>Email:</strong> ${newUser.email}
                        
                        <p>We're excited to have you on board, and you can start using our service right away.</p>
                        <p>If you have any questions or need assistance, please don't hesitate to contact our support team at pradiptimbadiya@gmail.com.</p>
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
      to: newUser.email,
      subject: "Home-Hub Market",
      html: emailTemp,
    };

    await sendEmail(mailOptions);
    const userData = newUser.getData();

    return res.status(201).json({
      success: true,
      User: userData,
      token: userToken,
      message: userMessage.GoogleLoginUser,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export const totalUserCount = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role === "USER") {
      return res
        .status(400)
        .json({ success: false, message: errorMessage.UserCantSeeTotal });
    }

    const users = await UserModel.find({role:"USER"}).count();
    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: errorMessage.UserNotFound });
    }

    return res.status(200).json({
      success: true,
      users,
      message: userMessage.TotalUser,
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};
