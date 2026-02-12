import mongoose, { Schema, type Model } from "mongoose";

export interface UserDocument extends mongoose.Document {
  userId: string;
  data: Map<string, string>;
}

const UserSchema = new Schema<UserDocument>(
  {
    userId: { type: String, required: true, unique: true },
    data: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

export const User: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", UserSchema);
