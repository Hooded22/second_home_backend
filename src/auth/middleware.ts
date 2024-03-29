import { NextFunction, Response, Request } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../../custom";
import config from "../config/appConfig";

function extractToken(bearerToken: string | undefined) {
  const tokenElementsArray = bearerToken?.split(" ");
  if (
    !!tokenElementsArray &&
    tokenElementsArray[0] === "Bearer" &&
    !!tokenElementsArray[1]
  ) {
    return tokenElementsArray[1];
  }

  return null;
}

function auth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req.header("Authorization"));
  if (!token) return res.status(401).send("Access denied");
  try {
    const tokenSecret: Secret = config.TOKEN_SECRET;
    const verified = jwt.verify(token, tokenSecret);
    if (!verified) {
      res.status(403).send("Inactive token");
    }
    req.user = verified as User;
    next();
  } catch (error) {
    res.status(403).send("Invalid token");
  }
}

export default auth;
