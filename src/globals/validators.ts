import { Request, Response, NextFunction } from "express";
import { isString } from "lodash";
import errorMessages from "../assets/errorMessages";

export function validateId(
  req: Request<any, any, { id?: string }>,
  res: Response,
  next: NextFunction
) {
  if (!req.body.id || !isString(req.body.id)) {
    res.send(404).send(errorMessages.incorectId);
  }
  next();
}

export function validateQueryId(
  req: Request<any, any, { id?: string }>,
  res: Response,
  next: NextFunction
) {
  if (!req.query.id || !isString(req.query.id)) {
    res.send(404).send(errorMessages.incorectId);
  }
  next();
}
