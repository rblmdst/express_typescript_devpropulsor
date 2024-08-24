import express, { Request, Response } from "express";
import { employeeRouter } from "./employees/employee.routes";
import { errorHandler } from "./core/middlewares/error.middleware";
import { connectDb } from "./core/db";
import { authRouterFactory } from "./authentication/auth.routes";
import { createAuthMiddlewareFactory } from "./authentication/auth.middleware";
import {
  ConfigService,
  createConfigServiceFactory,
} from "./core/services/configuration.service";

const main = async (configService: ConfigService) => {
  const PORT = configService.get("port") as number;
  const DB_URI = configService.get("dbUri") as string;

  try {
    await connectDb(DB_URI);
  } catch (error) {
    console.log("Error during connection to DB");
    console.log(error);
    process.exit(1);
  }

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
  app.listen(PORT, () => {
    console.log("Server started and listening on PORT ", PORT);
  });
};

const configService = createConfigServiceFactory();

// boostrap
main(configService).catch((err) => {
  console.log("Error during bootstraping");
  console.log(err);
  process.exit(1);
});
