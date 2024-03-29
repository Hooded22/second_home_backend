import Room from "./model";
import auth from "../auth/middleware";
import { Router, Request, Response } from "express";
import { isEmpty, result } from "lodash";
import { IRoom } from "./types";
import errorMessages from "../assets/errorMessages";
import {
  addRoomDataValidation,
  deleteRoomValidation,
  updateRoomDataValidation,
} from "./validation";
import RoomController from "./controllers";
import { handleError } from "../globals/utils";

const roomRouter = Router();
const roomController = new RoomController();

roomRouter.use("/", auth);

roomRouter.post(
  "/",
  addRoomDataValidation,
  async (req: Request<any, any, IRoom>, res: Response) => {
    try {
      const result = await roomController.addRoom(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }
);

roomRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = await roomController.getRoom();
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, errorMessages.findError);
  }
});

roomRouter.put(
  "/",
  updateRoomDataValidation,
  async (
    req: Request<any, any, Partial<IRoom>, { id: string }>,
    res: Response
  ) => {
    try {
      const result = await roomController.updateRoom(req.query.id, req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
);

roomRouter.delete(
  "/",
  deleteRoomValidation,
  async (req: Request<any, any, any, { id: string }>, res: Response) => {
    try {
      const result = await roomController.deleteRoom(req.query.id);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, errorMessages.incorectId);
    }
  }
);

export default roomRouter;
