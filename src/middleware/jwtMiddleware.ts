import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "kuhakuxxxx1232";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
     res.status(401).json({ message: "No token, authorization denied" });
     return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.log("Invalid token", err);
    res.status(403).json({ message: "Token is not valid" });
    return;
  }
};