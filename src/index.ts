import { connectDb } from "./core/db";
import {
  ConfigService,
  createConfigServiceFactory,
} from "./core/services/configuration.service";
import { createApp } from "./core/app";

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
