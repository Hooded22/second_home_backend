import {
  IReservation,
  IReservationUpdateData,
  ReservationFilters,
} from "./types";
import { NextFunction, Request, Response } from "express";
import { ac } from "../config/appConfig";
import { User } from "../../custom";
import errorMessages from "../assets/errorMessages";
import {
  validateAddReservationData,
  validateUpdateReservationData,
} from "./validators";
import Reservation from "./model";
import isEmpty from "lodash/isEmpty";
import { successMessages } from "../assets/successMessages";

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

export default class ReservationController {
  async getReservation(filters?: ReservationFilters) {
    try {
      const withFilters = filters && !isEmpty(filters);
      const reservations = withFilters
        ? await Reservation.find()
            .where(filters as ReservationFilters)
            .populate("roomId")
            .populate("customerId")
        : await Reservation.find().populate("roomId");
      return reservations;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
