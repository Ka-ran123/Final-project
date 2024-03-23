import mongoose, { Schema } from "mongoose";
import validator from "validator";

const feedbackSchema = new Schema({
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
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  profilePic:{
    type:String,
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const FeedBackModel = mongoose.model("feedback", feedbackSchema);

export { FeedBackModel };
