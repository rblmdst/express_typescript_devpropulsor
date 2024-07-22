import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const infos = `[${new Date()}] ${req.url} : ${req.method}`;
  console.log(infos);
  next();
};
