import { Request, Response, Router } from "express";
import errorMessages from "../assets/errorMessages";
import ReservationController, {
  addReservationValidation,
  deleteReservationValidation,
  getAllReservationsValidation,
  getOwnReservationsValdation,
  updateReservationValidation,
} from "./controller";
import Reservation from "./model";
import User from "../users/model";
import {
  IReservation,
  IReservationUpdateData,
  ReservationFilters,
} from "./types";
import auth from "../auth/middleware";
import isEmpty from "lodash/isEmpty";

const reservationRouter = Router();
const reservationController = new ReservationController();

reservationRouter.use("/", auth);

reservationRouter.get(
  "/",
  getAllReservationsValidation,
  async (
    req: Request<any, any, any, ReservationFilters | undefined>,
    res: Response
  ) => {
    try {
      const reservations = await reservationController.getReservation(
        req.query
      );
      return res.status(200).json(reservations);
    } catch (error: any) {
      return res.status(400).send({ error: new Error(error).message });
    }
  }
);

reservationRouter.get(
  "/myReservations",
  getOwnReservationsValdation,
  async (req: Request, res: Response) => {
    try {
      const reservations = await Reservation.find().where({
        customerId: req.user?._id,
      });
      return res.status(200).json(reservations);
    } catch (error: any) {
      console.log("ERR: ", error);
      return res.status(400).send(error.message);
    }
  }
);

reservationRouter.post(
  "/",
  addReservationValidation,
  async (req: Request<any, any, IReservation>, res: Response) => {
    try {
      const reservation = new Reservation(req.body);
      const savedReservation = await reservation.save();
      return res.status(200).json(savedReservation);
    } catch (error: any) {
      return res.status(400).send({ error: new Error(error).message });
    }
  }
);

reservationRouter.put(
  "/",
  updateReservationValidation,
  async (
    req: Request<any, any, Partial<IReservation>, { id: string }>,
    res: Response
  ) => {
    try {
      const result = await Reservation.findByIdAndUpdate(
        req.query.id,
        req.body
      );
      if (result) {
        result.save();
        const newReservation = await Reservation.findById(result._id);
        return res.status(200).send(newReservation);
      } else {
        return res
          .status(400)
          .send({ error: new Error(errorMessages.incorectId).message });
      }
    } catch (error) {
      return res
        .status(400)
        .send({ error: new Error(errorMessages.incorectId).message });
    }
  }
);

reservationRouter.delete(
  "/",
  deleteReservationValidation,
  async (req: Request<any, any, any, { id: string }>, res: Response) => {
    try {
      await Reservation.findByIdAndDelete(req.query.id);
      const allReservations = await Reservation.find()
        .populate("roomId")
        .populate("customerId");
      return res.status(200).json(allReservations);
    } catch (error) {
      console.error(error);
      return res.status(400).send({ error: errorMessages.incorectId });
    }
  }
);

reservationRouter.post("/endReservation");

reservationRouter.post("/delayReservation");

export default reservationRouter;
