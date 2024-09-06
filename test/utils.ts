import { connectDb } from "../src/core/db";
import { createConfigServiceFactory } from "../src/core/services/configuration.service";
import { createApp } from "../src/core/app";

export const createTestApp = async () => {
  const configService = createConfigServiceFactory();
  const DB_URI = configService.get("dbUri") as string;

  try {
    await connectDb(DB_URI);
  } catch (error) {
    console.log("Error during connection to DB");
    console.log(error);
    process.exit(1);
  }
  return createApp(configService);
};
