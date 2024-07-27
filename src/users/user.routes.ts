import { Router, json, urlencoded } from "express";
import { userControllerFactory } from "./user.controller";
import { userRepositoryFactory } from "./user.repository";
import { userServiceFactory } from "./user.service";

export const userRouter = Router();
const jsonParser = json();
const bodyParser = urlencoded();

// deps
const userRepository = userRepositoryFactory();
const userService = userServiceFactory(userRepository);
const userController = userControllerFactory(userService);

// localhost:3000/users?department=IT
userRouter.get("/", userController.getAllUsers);

userRouter.get("/:userId", userController.getUserById);

userRouter.delete("/:userId", userController.deteleUser);

userRouter.post("/", bodyParser, jsonParser, userController.createUser);
