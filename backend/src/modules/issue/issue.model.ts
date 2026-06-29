import mongoose, { Document, Schema } from "mongoose";

export interface IIssue extends Document {
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  createdBy: mongoose.Types.ObjectId;
}

const issueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Pothole",
        "Garbage",
        "Water Logging",
        "Streetlight",
        "Road Damage",
        "Other",
      ],
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    latitude: Number,

    longitude: Number,

    address: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Issue = mongoose.model<IIssue>(
  "Issue",
  issueSchema
);