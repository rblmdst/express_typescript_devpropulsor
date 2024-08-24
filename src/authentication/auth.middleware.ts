import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "./utils";
import { ConfigService } from "../core/services/configuration.service";

const bearerPattern = /^bearer\s+.+/i;
// Authorization: Bearer <token>
// bearer dkdkdkkd
export const createAuthMiddlewareFactory = (configService: ConfigService) => {
  const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.get("Authorization") || "";
    if (!authHeader.match(bearerPattern)) {
      return res.status(401).json({
        error:
          "Invalid Authorization header. Expected format is : 'Authorization: Bearer <token>'",
      });
    }
    const token = authHeader.split(" ")[1].trim();

    try {
      const decoded = await verifyJWT(
        token,
        configService.get("jwtSecret") as string
      );
      (req as any).user = decoded;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expired",
        });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Invalid Token",
        });
      }
      return next(error);
    }
    return next();
  };

  return authMiddleware;
};
