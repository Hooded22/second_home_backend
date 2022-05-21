import {
  IReservation,
  IReservationUpdateData,
  ReservationFilters,
} from "../types/reservationTypes";
import { NextFunction, Request, Response } from "express";
import { ac } from "../config/appConfig";
import { User } from "../../custom";
import errorMessages from "../assets/errorMessages";
import {
  validateAddReservationData,
  validateUpdateReservationData,
} from "../validators/reservationValidators";

export function getAllReservationsValidation(
  req: Request<any, any, any, ReservationFilters | undefined>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!ac.can(req.user?.role || "").read("reservations").granted)
      throw new Error(errorMessages.permissionDenied);
    next();
  } catch (error: any) {
    return res.send(400).send(error.message);
  }
}

export function getOwnReservationsValdation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!ac.can(req.user?.role || "").readOwn("reservations").granted)
      throw new Error(errorMessages.permissionDenied);
    next();
  } catch (error: any) {
    return res.send(400).send(error.message);
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
    return res.status(400).send(error.message);
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
