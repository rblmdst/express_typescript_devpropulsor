export type Department = "IT" | "Marketing" | "HR";
export type Level = "J" | "M" | "S";

export interface User {
  id: string;
  name: string;
  department: Department;
  level: Level;
}
