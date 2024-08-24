import { Router, json } from "express";
import { authControllerFactory } from "./auth.controller";
import { userServiceFactory } from "../users/user.service";
import { userRepositoryFactory } from "../users/user.repository";
import { ConfigService } from "../core/services/configuration.service";

export const authRouterFactory = (configService: ConfigService) => {
  const authRouter = Router();

  const userRepository = userRepositoryFactory();
  const userService = userServiceFactory(userRepository, configService);
  const authController = authControllerFactory(userService);

  authRouter.post("/register", json(), authController.register);

  authRouter.post("/login", json(), authController.login);

  return authRouter;
};
