import { Types } from "mongoose";

export type Department = "IT" | "Marketing" | "HR";
export type Level = "J" | "M" | "S";

export interface Employee {
  _id: Types.ObjectId;
  name: string;
  department: Department;
  level: Level;
  createdBy?: Types.ObjectId;
}
