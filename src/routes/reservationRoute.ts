import { Request, Response, Router } from "express";
import errorMessages from "../assets/errorMessages";
import {
  addReservationValidation,
  deleteReservationValidation,
  getAllReservationsValidation,
  getOwnReservationsValdation,
  updateReservationValidation,
} from "../controllers/reservationControllers";
import Reservation from "../models/reservationModel";
import User from "../models/userModel";
import {
  IReservation,
  IReservationUpdateData,
  ReservationFilters,
} from "../types/reservationTypes";
import auth from "./verifyToken";

const reservationRouter = Router();

reservationRouter.use("/", auth);

reservationRouter.get(
  "/",
  getAllReservationsValidation,
  async (
    req: Request<any, any, any, ReservationFilters | undefined>,
    res: Response
  ) => {
    try {
      const reservations = req.query
        ? await Reservation.find()
            .where(req.query)
            .populate("roomId")
            .populate("customerId")
        : await Reservation.find().populate("roomId");
      return res.status(200).json(reservations);
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  }
);

reservationRouter.get(
  "/myReservations",
  getOwnReservationsValdation,
  async (req: Request, res: Response) => {
    try {
      const reservations = Reservation.find().where({
        customerId: req.user?._id,
      });
      return res.status(200).json(reservations);
    } catch (error: any) {
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
    } catch (error) {
      return res.status(400).send({ error });
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
        return res.status(400).send(errorMessages.incorectId);
      }
    } catch (error) {
      return res.status(400).send(errorMessages.incorectId);
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
