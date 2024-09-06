import { authRouterFactory } from "../authentication/auth.routes";
import { createAuthMiddlewareFactory } from "../authentication/auth.middleware";
import express, { Request, Response } from "express";
import { employeeRouter } from "../employees/employee.routes";
import { errorHandler } from "../core/middlewares/error.middleware";
import { ConfigService } from "./services/configuration.service";

export const createApp = (configService: ConfigService) => {
  const app = express();
  app.use(
    "/employees",
    createAuthMiddlewareFactory(configService),
    employeeRouter
  );
  app.use("/auth", authRouterFactory(configService));

  app.get("/", (req: Request, res: Response) => {
    res.end("OK");
  });

  app.use(errorHandler);

  return app;
};
