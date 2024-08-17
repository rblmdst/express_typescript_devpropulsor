import { Router, json } from "express";
import { authControllerFactory } from "./auth.controller";
import { userServiceFactory } from "../users/use.service";
import { userRepositoryFactory } from "../users/user.repository";

export const authRouter = Router();

const userRepository = userRepositoryFactory();
const userService = userServiceFactory(userRepository);
const authController = authControllerFactory(userService);

authRouter.post("/register", json(), authController.register);

authRouter.post("/login", json(), authController.login);
