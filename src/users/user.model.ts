import { Schema, model } from "mongoose";
import { emailPattern } from "../core/const";
import { User } from "./user.interface";

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    match: [emailPattern, "Email is invalid"],
    unique: true,
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

export const UserModel = model<User>("User", userSchema);
