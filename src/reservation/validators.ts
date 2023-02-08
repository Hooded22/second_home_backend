import Joi from "joi";
import {
  IReservation,
  IReservationUpdateData,
  ReservationFilters,
  ReservationStatuses,
} from "./types";
import { NextFunction, Request, Response } from "express";
import { ac } from "../config/appConfig";
import errorMessages from "../assets/errorMessages";

const addReservationValidationSchema = Joi.object({
  customerId: Joi.string().required(),
  startTime: Joi.date().default(new Date()),
  endTime: Joi.date(),
  roomId: Joi.string().required(),
});

const updateReservationValidationSchema = Joi.object({
  customerId: Joi.string(),
  startTime: Joi.date().default(new Date()),
  endTime: Joi.date(),
  roomId: Joi.string(),
  status: Joi.string().valid(...Object.values(ReservationStatuses)),
});

export function validateAddReservationData(data: IReservation) {
  const { error } = addReservationValidationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return;
}

export function validateUpdateReservationData(data: IReservationUpdateData) {
  const { error } = updateReservationValidationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return;
}

export function getAllReservationsValidation(
  req: Request<any, any, any, ReservationFilters | undefined>,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.user);

    if (!ac.can(req.user?.role || "").read("reservation").granted)
      throw new Error(errorMessages.permissionDenied);
    next();
  } catch (error: any) {
    console.log("ERR: ", error);
    return res.status(403).send({ error: new Error(error).message });
  }
}

export function getOwnReservationsValdation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!ac.can(req.user?.role || "").readOwn("reservation").granted)
      throw new Error(errorMessages.permissionDenied);
    next();
  } catch (error: any) {
    console.log("ERRor: ", error, req.user);
    return res.status(400).send({ error: new Error(error).message });
  }
}

export function addReservationValidation(
  req: Request<any, any, IReservation>,
  res: Response,
  next: NextFunction
) {
  try {
    validateAddReservationData(req.body);
    next();
  } catch (error: any) {
    return res.status(400).send({ error: new Error(error).message });
  }
}

export function updateReservationValidation(
  req: Request<any, any, IReservationUpdateData>,
  res: Response,
  next: NextFunction
) {
  try {
    validateUpdateReservationData(req.body);
    next();
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
}

export async function deleteReservationValidation(
  req: Request<any, any, any, { id: string }>,
  res: Response,
  next: NextFunction
) {
  if (!req.query.id) {
    res.status(400).send({ error: errorMessages.incorectId });
  } else {
    next();
  }
}
