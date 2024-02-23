import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  type: {
    type: String,
    enum: {
      values: ["Sell", "Rent"],
      message: "Plz ! Select One..!",
    },
    required: true,
  },
  description: {
    type: String,
  },
  propertyImage: {
    type: [String],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  propertyAge: {
    type: String,
    required: true,
  },
  floorNo: {
    type: String,
    required: true,
  },
  rooms: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    enum: {
      values: ["Appartement", "Independent House", "Villa", "Affordable House"],
      message: "Plz ! Select One..!",
    },
    required: true,
  },
  faching: {
    type: String,
    enum: {
      values: ["North", "East", "South", "West"],
      message: "Plz ! Select One..!",
    },
    required: true,
  },
  houseType: {
    type: String,
    enum: {
      values: ["1Rk", "1BK", "2BHK", "3+BHK"],
      message: "Plz ! Select One..!",
    },
    required: true,
  },
  facility: {
    type: [String],
    required: true,
  },
  furnishing: {
    type: String,
    enum: {
      values: ["Unfurnished", "Semi Furnished", "Fully Furnished"],
      message: "Plz ! Select One..!",
    },
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["approval", "cancle", "pending"],
      message: "Plz ! Select One..!",
    },
    default: "pending"
  },
  mobileNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  agentId:{
    type:mongoose.Schema.Types.ObjectId,
    // ref:'user',
    default:null,
  }

},{timestamps:true});

const PropertyModel = mongoose.model("property", propertySchema);

export { PropertyModel };
