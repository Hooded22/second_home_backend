import { Request, Response, Router } from "express";
import errorMessages from "../assets/errorMessages";
import ReservationController from "./controller";
import {
  AddReservationBody,
  IReservation,
  ReservationFilters,
  ReservationStatuses,
} from "./types";
import auth from "../auth/middleware";
import {
  getAllReservationsValidation,
  getOwnReservationsValdation,
  addReservationValidation,
  updateReservationValidation,
  deleteReservationValidation,
} from "./validators";
import { validateQueryId } from "../globals/validators";
import { handleError } from "../globals/utils";

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
      return handleError(res, error);
    }
  }
);

reservationRouter.get(
  "/myReservations",
  getOwnReservationsValdation,
  async (req: Request, res: Response) => {
    try {
      const reservations = await reservationController.getMyReservations(
        req.user?._id
      );
      return res.status(200).json(reservations);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
);

reservationRouter.post(
  "/",
  addReservationValidation,
  async (req: Request<any, any, AddReservationBody>, res: Response) => {
    try {
      const savedReservation = await reservationController.addReservation(
        req.body
      );
      return res.status(200).json(savedReservation);
    } catch (error: any) {
      return handleError(res, error);
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
      const newReservation = await reservationController.updateReservation(
        req.query.id,
        req.body
      );
      return res.status(200).send(newReservation);
    } catch (error) {
      return handleError(res, errorMessages.incorectId);
    }
  }
);

reservationRouter.delete(
  "/",
  deleteReservationValidation,
  async (req: Request<any, any, any, { id: string }>, res: Response) => {
    try {
      const result = await reservationController.deleteReservation(
        req.query.id
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
);

reservationRouter.post(
  "/endReservation",
  validateQueryId,
  async (req: Request<any, any, any, { id: string }>, res: Response) => {
    try {
      const endedReservation = await reservationController.updateReservation(
        req.query.id,
        { status: ReservationStatuses.CLOSED }
      );
      return res.status(200).json(endedReservation);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
);

export default reservationRouter;
