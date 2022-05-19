import Joi from "joi";
import { IRoom, RoomStandard } from "../types/roomTypes";

const addRoomValidationSchema = Joi.object<IRoom>({
  number: Joi.number().greater(0).required(),
  floor: Joi.number().positive().required(),
  standard: Joi.string().valid(...Object.values(RoomStandard)),
  beds: Joi.number().positive().required(),
});

export function addRoomValidator(room: IRoom) {
  const { error } = addRoomValidationSchema.validate(room);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return;
}
