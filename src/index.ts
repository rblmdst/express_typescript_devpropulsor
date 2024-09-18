import { connectDb } from "./core/db";
import {
  ConfigService,
  createConfigServiceFactory,
} from "./core/services/configuration.service";
import { createApp } from "./core/app";
import { Server } from "http";
import mongoose from "mongoose";

let server: Server;
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

  const app = createApp(configService);

  const server = app.listen(PORT, () => {
    console.log("Server started and listening on PORT ", PORT);
  });
  return server;
};

const configService = createConfigServiceFactory();

// boostrap
main(configService)
  .then((serverInstance) => {
    server = serverInstance;
  })
  .catch((err) => {
    console.log("Error during bootstraping");
    console.log(err);
    process.exit(1);
  });

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception : ${err.message}`);
  gracefulShutdown(server, 1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(`Uncaught rejection : ${promise} ${reason}`);
  gracefulShutdown(server, 1);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT");
  gracefulShutdown(server);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
  gracefulShutdown(server);
});

function gracefulShutdown(server: Server, exitCode = 0) {
  console.log("Graceful Shutdown... will close connections...");

  server.close(() => {
    console.log("Closed HTTP connections");
    mongoose.connection.close(false).then(() => {
      console.log("Connection to MongoDB closed");
      console.log({ exitCode });
      process.exit(exitCode || 0);
    });
  });

  setTimeout(() => {
    mongoose.connection.close(true).then(() => {
      console.log("Connection to MongoDB force closed");
      process.exit(1);
    });
  }, 2000).unref();
}
