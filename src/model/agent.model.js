import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const agentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Validation Error");
                }
            },
        },
        mobileNo: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: null,
        },
        publicUrl: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            default: "AGENT",
        },
        age: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: {
                values: ["Male", "Female"],
                message: "Gender is not correct",
            },
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        bankAccountNo: {
            type: String,
            required: true
        },
        ifscCode: {
            type: String,
            required: true
        },
        aadharCardPic: {
            type: [String],
            required: true
        },
        panCardPic: {
            type: [String],
            required: true,
        },
        date: {
            type: Date,
            default: Date.now()
        }
    },
    { timestamps: true }
);

agentSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = bcrypt.genSaltSync(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

agentSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const AgentModel = mongoose.model("agent", agentSchema);

export { AgentModel };
