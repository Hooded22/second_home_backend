import { Request, Response, NextFunction } from "express";
import errorMessages from "../assets/errorMessages";
import RoomModel from "./model";
import { IRoom } from "./types";
import { addRoomValidator } from "./validators";

async function validateRoomNumber(roomNumber: number) {
  const roomWithNumber = await RoomModel.findOne({ number: roomNumber });
  if (roomWithNumber) {
    throw new Error(errorMessages.roomWithNumberAlreadyExist);
  } else {
    return;
  }
}

export async function addRoomDataValidation(
  req: Request<any, any, IRoom>,
  res: Response,
  next: NextFunction
) {
  try {
    addRoomValidator(req.body);
    await validateRoomNumber(req.body.number);
    next();
  } catch (error: any) {
    return res.status(400).send({ error: error.message });
  }
}

export async function updateRoomDataValidation(
  req: Request<any, any, Partial<IRoom>, { id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const room = await RoomModel.findById(req.query.id);
    if (room) {
      const newData: IRoom = {
        number: room.number,
        floor: room.floor,
        beds: room.beds,
        standard: room.standard,
        price: room.price,
        ...req.body,
      };
      addRoomValidator(newData);
      if (req.body.number) {
        await validateRoomNumber(req.body.number);
      }
      next();
    } else {
      throw new Error("Incorect room id");
    }
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
}

export async function deleteRoomValidation(
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