import { Employee } from "./employee.interface";

export interface EmployeeRepository {
  getAll: (department?: string) => Promise<Employee[]>;
  getById: (employeeId: string) => Promise<Employee | null>;
  delete: (employeeId: string) => Promise<void>;
  create: (
    employee: Omit<Employee, "_id">,
    creatorId: string
  ) => Promise<Employee>;
}
