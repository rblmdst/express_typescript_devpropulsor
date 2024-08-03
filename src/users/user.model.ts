import { Schema, model } from "mongoose";
import { User } from "./user.interface";

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  department: { type: String, required: true, enum: ["IT", "Marketing", "HR"] },
  level: { type: String, required: true, enum: ["J", "M", "S"] },
});
export const UserModel = model<User>("user", userSchema);
