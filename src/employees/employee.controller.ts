import { Request, Response } from "express";
import { EmployeeService } from "./employee.service";
import { createValidator } from "@rblmdst/scheval";
import { isValidObjectId } from "mongoose";

export function employeeControllerFactory(employeeService: EmployeeService) {
  return {
    getAllEmployees: async (req: Request, res: Response) => {
      const { department } = req.query;
      const employees = await employeeService.getEmployees(
        department as string | undefined
      );
      res.json(employees);
    },
    getEmployeeById: async (req: Request, res: Response) => {
      const { employeeId } = req.params;
      if (!isValidObjectId(employeeId)) {
        res.status(404);
        return res.end();
      }
      const employee = await employeeService.getEmployee(employeeId);
      if (employee) {
        return res.json(employee);
      }
      res.status(404);
      res.end();
    },
    deteleEmployee: async (req: Request, res: Response) => {
      const { employeeId } = req.params;
      if (!isValidObjectId(employeeId)) {
        res.status(404);
        return res.end();
      }
      const employee = await employeeService.getEmployee(employeeId);
      if (!employee) {
        res.status(404);
        return res.send();
      }
      const connectedUserId = (req as any).user._id;
      if (employee.createdBy?.toString() !== connectedUserId) {
        return res
          .status(403)
          .json({
            error: "Only creator of an employee can delete that employee.",
          });
      }
      await employeeService.deleteEmployee(employeeId);
      res.status(204);
      res.end();
    },
    createEmployee: async (req: Request, res: Response) => {
      const { department, name, level } = req.body;
      const connectedUserId = (req as any).user._id;

      const employeeData = { department, name, level };
      const validatorConfig = {
        department: {
          type: ["string", "The employee department must be a string"],
          required: ["The employee department is required"],
          enum: [
            ["IT", "Marketing", "HR"],
            "The employee department must be take one of the following values: 'IT', 'Marketing', 'HR'",
          ],
        },
        name: {
          type: ["string", "The employee name must be a string"],
          required: ["The employee name is required"],
        },
        level: {
          type: ["string", "The employee department must be a string"],
          required: ["The employee department is required"],
          enum: [
            ["M", "J", "S"],
            "The employee department must be take one of the following values: 'M', 'J', 'S'",
          ],
        },
      };
      const validator = createValidator(validatorConfig);
      const validationErrors = validator.validate(employeeData);
      if (validationErrors.length) {
        res.status(400);
        return res.json(validationErrors);
      }
      const employee = await employeeService.createEmployee(
        employeeData,
        connectedUserId
      );
      res.status(201);
      return res.json(employee);
    },
  };
}
