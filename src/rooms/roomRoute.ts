import Room from "./roomModel";
import auth from "../routes/verifyToken";
import { Router, Request, Response } from "express";
import { isEmpty } from "lodash";
import { IRoom } from "./roomTypes";
import {
  addRoomDataValidation,
  deleteRoomValidation,
  updateRoomDataValidation,
} from "./roomControllers";
import errorMessages from "../assets/errorMessages";

const roomRouter = Router();

roomRouter.use("/", auth);

roomRouter.post(
  "/",
  addRoomDataValidation,
  async (req: Request<any, any, IRoom>, res: Response) => {
    try {
      const room = new Room(req.body);
      const savedRoom = await room.save();
      return res.status(200).json(savedRoom);
    } catch (error) {
      return res.status(400).send({ error });
    }
  }
);

roomRouter.get("/", async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    if (isEmpty(rooms)) {
      return res.status(404).json(rooms);
    }
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(400).send({ error: errorMessages.findError });
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
      const result = await Room.findByIdAndUpdate(req.query.id, req.body);
      if (result) {
        const newRoom = await Room.findById(result._id);
        return res.status(200).send(newRoom);
      } else {
        return res.status(400).send("Incorect id");
      }
    } catch (error) {
      return res.status(400).send("Incorect id");
    }
  }
);

roomRouter.delete(
  "/",
  deleteRoomValidation,
  async (req: Request<any, any, any, { id: string }>, res: Response) => {
    try {
      await Room.findByIdAndDelete(req.query.id);
      return res.status(200).send({ message: "Delete successfully" });
    } catch (error) {
      return res.status(400).send({ error: errorMessages.incorectId });
    }
  }
);

export default roomRouter;
