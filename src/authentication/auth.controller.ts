import { createValidator } from "@rblmdst/scheval";
import { Request, Response } from "express";
import { passwordPattern } from "../core/const";
import { UserService } from "../users/user.service";
import { ConfigService } from "../core/services/configuration.service";

export const authControllerFactory = (userService: UserService) => {
  return {
    register: async (req: Request, res: Response) => {
      const { email, password, firstName, lastName } = req.body;
      const userData = { email, password, firstName, lastName };

      const validatorConfig = {
        email: {
          type: ["string", "The user email must be a string"],
          required: ["The user email is required"],
          email: ["Invalid email address"],
        },
        password: {
          type: ["string", "The user password must be a string"],
          required: ["The user password is required"],
          match: [
            passwordPattern,
            "The password must contains lowercase uppercase digit and special character and it is 8 characters minimum",
          ],
        },
        firstName: {
          type: ["string", "The user firstName must be a string"],
          required: ["The user firstName is required"],
        },
        lastName: {
          type: ["string", "The user lastName must be a string"],
          required: ["The user lastName is required"],
        },
      };
      const validator = createValidator(validatorConfig);
      const validationErrors = validator.validate(userData);
      if (validationErrors.length) {
        res.status(400);
        return res.json(validationErrors);
      }
      const createUser = await userService.registerUser(userData);
      res.status(201);
      return res.json(createUser);
    },
    login: async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const userData = { email, password };

      const validatorConfig = {
        email: {
          type: ["string", "The user email must be a string"],
          required: ["The user email is required"],
          email: ["Invalid email address"],
        },
        password: {
          type: ["string", "The user password must be a string"],
          required: ["The user password is required"],
        },
      };
      const validator = createValidator(validatorConfig);
      const validationErrors = validator.validate(userData);
      if (validationErrors.length) {
        res.status(400);
        return res.json(validationErrors);
      }
      const user = await userService.getUserByEmail(userData.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const passwordIsValid = await userService.checkPassword(
        userData.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = await userService.generateAuthToken(user);

      return res.status(200).json({ token });
    },
  };
};
