import { Request, Response, Router, json, urlencoded } from "express";
import { users as userList } from "./users";
let users = [...userList];

export const userRouter = Router();
const jsonParser = json();
const bodyParser = urlencoded();

// localhost:3000/users?department=IT
userRouter.get("/", (req: Request, res: Response) => {
  const { department } = req.query;
  if (department) {
    return res.json(
      users.filter(
        (user) =>
          user.department.toLowerCase() === (department as string).toLowerCase()
      )
    );
  }
  res.json(users);
});

userRouter.get("/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = users.find((user) => user.id === userId);
  if (user) {
    return res.json(user);
  }
  res.status(404);
  res.end();
});

userRouter.delete("/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = users.find((user) => user.id === userId);
  if (!user) {
    res.status(404);
    return res.send();
  }

  users = users.filter((user) => user.id !== userId);
  res.status(204);
  res.end();
});

userRouter.post("/", bodyParser, jsonParser, (req: Request, res: Response) => {
  const { department, name, level } = req.body;
  const id = crypto.randomUUID();
  const user = { id, department, name, level };
  users = [...users, user];
  res.status(201);
  return res.json(user);
});
