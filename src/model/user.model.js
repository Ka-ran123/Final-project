import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
    },
    mobileNo: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (
          !validator.isMobilePhone(value, "any", {
            strictMode: false,
          })
        ) {
          throw new Error("Validation Error");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: null,
      trim: true,
    },
    publicUrl: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ["USER", "ADMIN"],
        message: "Role is not correct",
      },
      required: true,
      default: "USER",
      trim: true,
    },
    isLogin: {
      type: Boolean,
      default: false,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getData = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profilePic: this.profilePic,
    isLogin: this.isLogin,
  };
};

const UserModel = mongoose.model("user", userSchema);

export { UserModel };
