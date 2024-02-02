import { UserModel } from "../model/user.model.js";
import { generateToken } from "../utils/genToken.js";
import { transporter } from "../utils/nodemailer.js";
import { generateOTP } from "../utils/genOtp.js";
import { OtpModel } from "../model/otp.model.js";

const userController = {
  signUp: async function (req, res) {
    try {
      const data = req.body;

      const findUser = await UserModel.findOne({ email: data.email });

      if (data.role === "ADMIN") {
        const response = {
          statusCode: 401,
          sucess: false,
          message: "Select USER role",
        };
        return res.status(200).json(response);
      }

      if (findUser) {
        const response = {
          statusCode: 401,
          success: false,
          message: "User Already Exits",
        };
        return res.status(200).json(response);
      }

      const user = new UserModel(data);
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
        statusCode: 500,
        sucess: false,
        message: "Server Error",
      };
      return res.status(200).json(response);
    }
  },
  signIn: async function (req, res) {
    try {
      const { email, password } = req.body;
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
        "-password -publicUrl -isLogin"
      );
      const token = generateToken({ id: findUser._id });

      const response = {
        statusCode: 201,
        success: true,
        token: token,
        user,
        message: "User logged In Successfully",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 500,
        sucess: false,
        message: "Server Error",
      };
      return res.status(200).json(response);
    }
  },
  verifyEmail: async function (req, res) {
    try {
      const { email } = req.body;

      const findUser = await UserModel.findOne({ email: email });

      if (!findUser) {
        const response = {
          statusCode: 401,
          sucess: false,
          message: "User Not Exits",
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
        subject: "Verify Email OTP ",
        html: mailFormat,
      };

      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
            const response = {
                statusCode: 400,
                sucess: false,
                message: err.message,
              };
            return res.status(200).json(response);
        } else {
          await OtpModel.findOneAndDelete({ email: findUser.email });
          const user =  new OtpModel({ email: findUser.email, otp: otp });
          await user.save();

          setTimeout(async () => {
            await OtpModel.findOneAndDelete({ email: findUser.email });
          }, 1000 * 60);
        }
      });

      const response = {
        statusCode: 201,
        success: true,
        message: "OTP send for E-mail Verifycation",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response = {
        statusCode: 500,
        sucess: false,
        message: "Server Error",
      };
      return res.status(200).json(response);
    }
  },
  verifyOtp:async function(req,res){
    try {
        const {email,otp}=req.body;

        const findUser=await OtpModel.findOne({email})

        if (!findUser) {
            const response = {
              statusCode: 401,
              sucess: false,
              message: "OTP Not Send",
            };
            return res.status(200).json(response);
          }

        if(findUser.otp !== otp)
        {
            const response = {
                statusCode: 401,
                sucess: false,
                message: "OTP is Wrong",
              };
              return res.status(200).json(response);
        }

        await OtpModel.findOneAndDelete({email:findUser.email})

        const response = {
            statusCode: 201,
            sucess: true,
            message: "OTP is Right",
          };
          return res.status(200).json(response);
        
    } catch (error) {
        const response = {
            statusCode: 500,
            sucess: false,
            message: "Server Error",
          };
          return res.status(200).json(response);
    }
  }
};

export { userController };
