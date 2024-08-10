import { Employee } from "./employee.interface";
import { EmployeeModel } from "./employee.model";
import { EmployeeRepository } from "./employee.repository.interface";

export function employeeRepositoryFactory(): EmployeeRepository {
  return {
    getAll: async (department?: string) => {
      if (department) {
        return await EmployeeModel.find({ department });
      }
      return await EmployeeModel.find();
    },
    getById: async (employeeId: string) => {
      return await EmployeeModel.findById(employeeId);
    },
    delete: async (employeeId: string) => {
      await EmployeeModel.deleteOne({ _id: employeeId });
    },
    create: async (employee: Omit<Employee, "_id">) => {
      return await EmployeeModel.create(employee);
    },
  };
}
