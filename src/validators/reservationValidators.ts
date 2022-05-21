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
  status: Joi.string().default(ReservationStatuses.OPEN),
  days: Joi.number().default(1),
  cost: Joi.number().required(),
  roomId: Joi.string().required(),
  cardNumber: Joi.number().required(),
});

const updateReservationValidationSchema = Joi.object({
  ...addReservationValidationSchema,
  status: undefined,
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
