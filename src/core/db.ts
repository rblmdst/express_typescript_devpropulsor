import mongoose from "mongoose";

export const connectDb = (
  uri: string,
  options: { dbName: string; user: string; pass: string }
) => {
  mongoose.connection.on("connected", () => {
    console.log("Successfully connected to DB");
  });
  return mongoose.connect(uri, options);
};
