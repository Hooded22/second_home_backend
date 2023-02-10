import Joi from "joi";
import {
  AddReservationBody,
  IReservation,
  IReservationUpdateData,
  ReservationFilters,
  ReservationStatuses,
} from "./types";
import { NextFunction, Request, Response } from "express";
import { ac } from "../config/appConfig";
import errorMessages from "../assets/errorMessages";
import ReservationModel from "./model";
import { handleError } from "../globals/utils";

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

export function validateAddReservationData(data: AddReservationBody) {
  const { error } = addReservationValidationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return;
}

async function validateRoomOccupation(roomId: string) {
  try {
    const roomReservations = await ReservationModel.find().where({ roomId });
    if (
      roomReservations.length > 0 &&
      !roomReservations.some(
        (reservation) => reservation.status === ReservationStatuses.CLOSED
      )
    ) {
      throw new Error("Room is occupied").message;
    }
  } catch (error: any) {
    throw new Error(error).message;
  }
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
    if (!ac.can(req.user?.role || "").read("reservation").granted)
      throw new Error(errorMessages.permissionDenied);
    next();
  } catch (error: any) {
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
    return res.status(400).send({ error: new Error(error).message });
  }
}

export async function addReservationValidation(
  req: Request<any, any, AddReservationBody>,
  res: Response,
  next: NextFunction
) {
  try {
    validateAddReservationData(req.body);
    await validateRoomOccupation(req.body.roomId);
    next();
  } catch (error: any) {
    return handleError(res, error);
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
