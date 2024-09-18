import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error Handler");
  console.error(err.stack);
  if (err.name === "MongoServerError" && err.errorResponse.code === 11000) {
    const { keyValue } = err.errorResponse;
    //[ { field: "email", errors: ["err1"]}]
    const errors = Object.entries(keyValue).map(([key, value]) => {
      const message = `Duplicate constraint violation. The value '${value}' is already used!!`;
      const fieldError = { field: key, errors: [message] };
      return fieldError;
    });
    return res.status(400).json(errors);
  }
  /* if(err instanceof Error){
    // do something
  } */
  return res.status(500).send("Unexpected Error");
};
