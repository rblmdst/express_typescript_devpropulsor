import express, { Request, Response } from "express";
import { userRouter } from "./users/user.routes";
import { errorHandler } from "./error.middleware";

const PORT = 3000;

const app = express();

app.use("/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.end("OK");
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log("Server started and listening on PORT ", PORT);
});
