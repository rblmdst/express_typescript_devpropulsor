import { Request, Response } from "express";
import { UserService } from "./user.service";
import { createValidator } from "@rblmdst/scheval";
import { isValidObjectId } from "mongoose";

export function userControllerFactory(userService: UserService) {
  return {
    getAllUsers: async (req: Request, res: Response) => {
      const { department } = req.query;
      const users = await userService.getUsers(
        department as string | undefined
      );
      res.json(users);
    },
    getUserById: async (req: Request, res: Response) => {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        res.status(404);
        return res.end();
      }
      const user = await userService.getUser(userId);
      if (user) {
        return res.json(user);
      }
      res.status(404);
      res.end();
    },
    deteleUser: async (req: Request, res: Response) => {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        res.status(404);
        return res.end();
      }
      const user = await userService.getUser(userId);
      if (!user) {
        res.status(404);
        return res.send();
      }
      await userService.deleteUser(userId);
      res.status(204);
      res.end();
    },
    createUser: async (req: Request, res: Response) => {
      const { department, name, level } = req.body;
      const userData = { department, name, level };
      const validatorConfig = {
        department: {
          type: ["string", "The user department must be a string"],
          required: ["The user department is required"],
          enum: [
            ["IT", "Marketing", "HR"],
            "The user department must be take one of the following values: 'IT', 'Marketing', 'HR'",
          ],
        },
        name: {
          type: ["string", "The user name must be a string"],
          required: ["The user name is required"],
        },
        level: {
          type: ["string", "The user department must be a string"],
          required: ["The user department is required"],
          enum: [
            ["M", "J", "S"],
            "The user department must be take one of the following values: 'M', 'J', 'S'",
          ],
        },
      };
      const validator = createValidator(validatorConfig);
      const validationErrors = validator.validate(userData);
      if (validationErrors.length) {
        res.status(400);
        return res.json(validationErrors);
      }
      const user = await userService.createUser(userData);
      res.status(201);
      return res.json(user);
    },
  };
}
