import { Schema, model } from "mongoose";
import { Employee } from "./employee.interface";

const employeeSchema = new Schema<Employee>({
  name: { type: String, required: true },
  department: { type: String, required: true, enum: ["IT", "Marketing", "HR"] },
  level: { type: String, required: true, enum: ["J", "M", "S"] },
  createdBy: { type: Schema.ObjectId, ref: "User" },
});
export const EmployeeModel = model<Employee>("employee", employeeSchema);
export type EmployeeModelType = typeof EmployeeModel;
