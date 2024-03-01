import { AgentModel } from "../model/agent.model.js";
import { generateToken } from "../utils/genToken.js";
import { publicUrl } from "../utils/profilepic.js";
import { transporter } from "../utils/nodemailer.js";
import { fileDestroyInCloudinary, fileUploadInCloudinary } from "../utils/clodinary.js";

const AgentController = {
    addAgent: async function (req, res) {
        try {
            const data = req.body;

            if ((data.name && data.email && data.mobileNo && data.password) === "") {
                const response = {
                    statusCode: 401,
                    sucess: false,
                    message: "Please Enter Valid Fiedls",
                };
                return res.status(200).json(response);
            }

            const findAgent = await AgentModel.findOne({ email: data.email });


            if (findAgent) {
                const response = {
                    statusCode: 401,
                    success: false,
                    message: "Agent Already Exits",
                };
                return res.status(200).json(response);
            }

            const nameFirstLetter = data.name.toLowerCase().slice(0, 1);
            const url = publicUrl(nameFirstLetter);



            const aadharCardImage = [];
            for (let i = 0; i < req.files['aadharCardPic'].length; i++) {
                let result = await fileUploadInCloudinary(req.files['aadharCardPic'][i].path);
                aadharCardImage.push(result.secure_url);
            }

            const panCardImage = [];
            for (let i = 0; i < req.files['panCardPic'].length; i++) {
                let result = await fileUploadInCloudinary(req.files['panCardPic'][i].path);
                panCardImage.push(result.secure_url);
            }

            data.aadharCardPic = aadharCardImage;
            data.panCardPic = panCardImage;

            const agent = new AgentModel({ ...data, profilePic: url, });
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
                        <p>Thank you for registering with Our app. You're now a part of our community.</p>
                        <p>Your account details:</p>
                        
                        <strong>Username:</strong> ${agent.name}<br>
                        <strong>Email:</strong> ${agent.email}
                        
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
                    to: agent.email,
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

            const response = {
                statusCode: 201,
                success: true,
                Agent: agent,
                token: token,
                message: "Agent registered Successfully",
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
    }
}

export { AgentController };