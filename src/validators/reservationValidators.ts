import Joi from "joi";
import {
  IReservation,
  IReservationUpdateData,
  ReservationStatuses,
} from "../types/reservationTypes";

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
