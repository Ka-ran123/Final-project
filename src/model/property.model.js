import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    type: {
      type: String,
      enum: {
        values: ["Sell", "Rent"],
        message: "Plz ! Select One..!",
      },
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    propertyImage: {
      type: [String],
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    propertyAge: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      enum: {
        values: [
          "Appartment",
          "Independent House",
          "Villa",
          "Affordable House",
        ],
        message: "Plz ! Select One..!",
      },
      required: true,
      trim: true,
    },
    faching: {
      type: String,
      enum: {
        values: ["North", "East", "South", "West"],
        message: "Plz ! Select One..!",
      },
      required: true,
      trim: true,
    },
    houseType: {
      type: String,
      enum: {
        values: ["1 BHK", "2 BHK", "3 BHK","3+ BHK"],
        message: "Plz ! Select One..!",
      },
      required: true,
      trim: true,
    },
    facility: {
      type: [String],
      required: true,
      trim: true,
    },
    furnishing: {
      type: String,
      enum: {
        values: ["Unfurnished", "Semi Furnished", "Fully Furnished"],
        message: "Plz ! Select One..!",
      },
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["approval", "cancel", "pending"],
        message: "Plz ! Select One..!",
      },
      default: "pending",
    },
    mobileNo: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agent",
      default: null,
    },
    isLike: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const PropertyModel = mongoose.model("property", propertySchema);

export { PropertyModel };
