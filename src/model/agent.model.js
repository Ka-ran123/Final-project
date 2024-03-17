import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const agentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim:true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Validation Error");
                }
            },
        },
        mobileNo: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        profilePic: {
            type: String,
            trim: true,
            default: null,
        },
        publicUrl: {
            type: String,
            default: null,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
            default: "AGENT",
        },
        age: {
            type: String,
            trim: true,
            required: true
        },
        gender: {
            type: String,
            enum: {
                values: ["Male", "Female"],
                message: "Gender is not correct",
            },
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        bankName: {
            type: String,
            required: true,
            trim: true
        },
        bankAccountNo: {
            type: String,
            required: true,
            trim: true
        },
        ifscCode: {
            type: String,
            required: true,
            trim: true
        },
        aadharCardPic: {
            type: [String],
            required: true,
            trim: true
        },
        panCardPic: {
            type: [String],
            required: true,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now(),
            trim: true
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
