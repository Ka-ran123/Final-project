import { UserModel } from "../model/user.model.js";
import { generateToken } from "../utils/genToken.js";
import { transporter, sendEmail } from "../utils/nodemailer.js";
import { generateOTP } from "../utils/genOtp.js";
import { OtpModel } from "../model/otp.model.js";
import { publicUrl } from "../utils/profilepic.js";
import {
  fileDestroyInCloudinary,
  fileUploadInCloudinary,
} from "../utils/clodinary.js";

const userController = {
  signUp: async function (req, res) {
    try {
      const data = req.body;

      if (
        (data.name && data.email && data.mobileNo && data.password) ===
        undefined
      ) {
        const response = {
          statusCode: 401,
          sucess: false,
          message: "Please Enter Valid Fiedls",
        };
        return res.status(200).json(response);
      }

      const findUser = await UserModel.findOne({ email: data.email });

      // if (data.role === "ADMIN") {
      //   const response = {
      //     statusCode: 401,
      //     sucess: false,
      //     message: "Select USER role",
      //   };
      //   return res.status(200).json(response);
      // }

      if (findUser) {
        const response = {
          statusCode: 401,
          success: false,
          message: "User Already Exits",
        };
        return res.status(200).json(response);
      }

      const nameFirstLetter = data.name.toLowerCase().slice(0, 1);
      const url = publicUrl(nameFirstLetter);

      const user = new UserModel({ ...data, profilePic: url });
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

      transporter.sendMail(
        {
          to: user.email,
          subject: "Home-Hub Market",
          html: emailTemp,
        },
        (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Email Sent : " + info.response);
          }
        }
      );

      const userData = user.getData();
      const response = {
        statusCode: 201,
        success: true,
        User: userData,
        token: token,
        message: "User registered Successfully",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  signIn: async function (req, res) {
    try {
      const { email, password } = req.body;

      if ((email && password) === undefined) {
        const response = {
          statusCode: 401,
          sucess: false,
          message: "Please Enter Valid Fiedls",
        };
        return res.status(200).json(response);
      }

      const findUser = await UserModel.findOne({ email: email });

      if (!findUser) {
        const response = {
          statusCode: 401,
          sucess: false,
          message: "User Not Exits",
        };
        return res.status(200).json(response);
      }

      const matchPasssword = await findUser.isPasswordCorrect(password);

      if (!matchPasssword) {
        const response = {
          statusCode: 401,
          sucess: false,
          message: "Invalid User credentials",
        };
        return res.status(200).json(response);
      }

      const user = await UserModel.findById(findUser._id).select(
        "-password -publicUrl"
      );
      const token = generateToken({ id: findUser._id });

      const options = {
        httpOnly: true,
        secure: true,
      };

      const response = {
        statusCode: 201,
        success: true,
        token: token,
        user,
        message: "User logged In Successfully",
      };
      return res.status(200).cookie("Token", token, options).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  verifyEmail: async function (req, res) {
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
        subject: "Verify Email OTP ",
        html: mailFormat,
      };

      //  await transporter.sendMail(mailOptions, async (err, info) => {
      //     if (err) {
      //       const response = {
      //         statusCode: 400,
      //         sucess: false,
      //         message: err.message,
      //       };
      //       return res.status(200).json(response);
      //     } else {
      //       await OtpModel.findOneAndDelete({ email: email });
      //       const user = new OtpModel({ email: email, otp: otp });
      //       await user.save();

      //       setTimeout(async () => {
      //         await OtpModel.findOneAndDelete({ email: email });
      //       }, 1000 * 60);
      //     }
      //   });

      await sendEmail(mailOptions);
      await OtpModel.findOneAndDelete({ email: email });
      const user = new OtpModel({ email: email, otp: otp });
      await user.save();

      setTimeout(async () => {
        await OtpModel.findOneAndDelete({ email: email });
      }, 1000 * 60);

      const response = {
        statusCode: 201,
        success: true,
        message: "OTP send for E-mail Verifycation",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  verifyOtp: async function (req, res) {
    try {
      const { email, otp } = req.body;

      const findUser = await OtpModel.findOne({ email });

      if (!findUser) {
        const response = {
          statusCode: 401,
          sucess: false,
          message: "OTP Not Send",
        };
        return res.status(200).json(response);
      }

      if (findUser.otp !== otp) {
        const response = {
          statusCode: 401,
          sucess: false,
          message: "OTP is Wrong",
        };
        return res.status(200).json(response);
      }

      await OtpModel.findOneAndDelete({ email: findUser.email });

      const response = {
        statusCode: 200,
        sucess: true,
        message: "OTP is Right",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  forgetPassword: async function (req, res) {
    try {
      const { email } = req.body;
      const findUser = await UserModel.findOne({ email });
      if (!findUser) {
        const response = {
          statusCode: 404,
          success: false,
          message: "User Not Found",
        };
        return res.status(200).json(response);
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
        subject: "Forget Password OTP ",
        html: mailFormat,
      };

      // transporter.sendMail(mailOptions, async (error, info) => {
      //   if (error) {
      //     const response = { success: false, message: error.message };
      //     return res.status(400).json(response);
      //   } else {
      //     await OtpModel.findOneAndDelete({ email: findUser.email });
      //     const user = new OtpModel({ email: findUser.email, otp: otp });
      //     await user.save();

      //     setTimeout(async () => {
      //       await OtpModel.findOneAndDelete({ email: findUser.email });
      //     }, 1000 * 60);

      //     const response = { success: true, message: "Otp Send" };
      //     return res.status(200).json(response);
      //   }
      // });

      await sendEmail(mailOptions);
      await OtpModel.findOneAndDelete({ email: findUser.email });
      const user = new OtpModel({ email: findUser.email, otp: otp });
      await user.save();

      setTimeout(async () => {
        await OtpModel.findOneAndDelete({ email: findUser.email });
      }, 1000 * 60);

      const response = { statusCode: 200, success: true, message: "Otp Send" };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  resetPassword: async function (req, res) {
    try {
      const { email, newPassword } = req.body;
      const findUser = await UserModel.findOne({ email });
      if (!findUser) {
        const response = {
          statusCode: 404,
          success: false,
          message: "User Not Found",
        };
        return res.status(200).json(response);
      }

      findUser.password = newPassword;
      await findUser.save();

      const response = {
        statusCode: 200,
        success: true,
        message: "Password is Reset Successfully",
      };

      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  changePassword: async function (req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      const user = await UserModel.findById(req.user?._id);
      // console.log(user);

      const matchPasssword = await user.isPasswordCorrect(oldPassword);
      // console.log(matchPasssword);

      if (!matchPasssword) {
        const response = {
          statusCode: 400,
          sucess: false,
          message: "Invalid Old Password",
        };
        return res.status(200).json(response);
      }

      user.password = newPassword;
      await user.save({ validateBeforeSave: false }); //validation check ny kre

      const response = {
        statusCode: 200,
        sucess: true,
        message: "Password change Successfully",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  getCurrentUser: async function (req, res) {
    try {
      const response = {
        statusCode: 201,
        sucess: true,
        userData: req.user,
        message: "User Fetched Successfully",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  changeProfilePic: async function (req, res) {
    try {
      const user = await UserModel.findById(req.user?._id);

      if (!user) {
        const response = {
          statusCode: 404,
          sucess: false,
          message: "User Not Found",
        };
        return res.status(200).json(response);
      }

      const profilePicLocalPath = req.file?.path;

      if (!profilePicLocalPath) {
        const response = {
          statusCode: 404,
          sucess: false,
          message: "Profile Picture Not Found",
        };
        return res.status(200).json(response);
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

      const response = {
        statusCode: 200,
        sucess: true,
        message: "Profile Picture Change Successfully",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  deleteProfilePic: async function (req, res) {
    try {
      const user = await UserModel.findById(req.user?._id);

      if (!user) {
        const response = {
          statusCode: 404,
          sucess: false,
          message: "User Not Found",
        };
        return res.status(200).json(response);
      }

      await fileDestroyInCloudinary(user.publicUrl);

      const nameFirstLetter = user.name.toLowerCase().slice(0, 1);
      const url = publicUrl(nameFirstLetter);
      user.profilePic = url;
      user.publicUrl = null;
      await user.save();

      const response = {
        statusCode: 200,
        sucess: true,
        message: "Profile Pic Deleted Successfulyy",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        sucess: false,
        message: error.message,
      };
      return res.status(200).json(response);
    }
  },
  googleLoginUser: async function (req, res) {
    try {
      const token = req.body.token;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTID,
      });
      let payload = ticket.getPayload();
      const findUser = await UserModel.findOne({ email: payload.email });
      if (findUser) {
        const userToken = generateToken(findUser._id);
        const response = {
          success: true,
          data: findUser.getData(),
          message: "SignIn successfully",
          token: userToken,
        };
        return res.status(200).json(response);
      }
      const result = await uploads(payload.picture, "profile");
      const newUser = new UserModel({
        name: payload.name,
        email: payload.email,
        image: result.secure_url,
        publicUrl: result.public_id,
        isLogin: true,
      });
      await newUser.save();
      const userData = newUser.getData();
      const userToken = generateToken(newUser._id);
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
                          <p>Dear ${userData.name},</p>
                          <p>Thank you for registering with Our app. You're now a part of our community.</p>
                          <p>Your account details:</p>
                          
                          <strong>Username:</strong> ${userData.name}<br>
                          <strong>Email:</strong> ${userData.email}
                          
                          <p>We're excited to have you on board, and you can start using our service right away.</p>
                          <p>If you have any questions or need assistance, please don't hesitate to contact our support team at pradiptimbadiya@gmail.com.</p>
                          <p>Best regards,</p>
                          <p>Todolist</p>
                      </div>
                  </td>
              </tr>
          </table>
      </td>
  </tr>
</table>

      `;
      // transporter.sendMail(
      //   {
      //     to: userData.email,
      //     subject: "Home-Hub Market",
      //     html: emailTemp,
      //   },
      //   (err, info) => {
      //     if (err) {
      //     } else {
      //       console.log("Email Sent : " + info.response);
      //     }
      //   }
      // );
      await sendEmail({
        to: userData.email,
        subject: "Home-Hub Market",
        html: emailTemp,
      });
      const response = {
        statusCode: 201,
        success: true,
        data: userData,
        message: "New User Created",
        token: userToken,
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 501,
        success: false,
        message: error.message,
      };
      return res.status(400).json(response);
    }
  },
};

export { userController };
