import { AddReservationBody, IReservation, ReservationFilters } from "./types";
import errorMessages from "../assets/errorMessages";
import Reservation from "./model";
import isEmpty from "lodash/isEmpty";

export default class ReservationController {
  async getReservation(filters?: ReservationFilters) {
    try {
      const withFilters = filters && !isEmpty(filters);
      const reservations = withFilters
        ? await Reservation.find()
            .where(filters as ReservationFilters)
            .populate("roomId")
            .populate("customerId")
        : await Reservation.find().populate("roomId");
      return reservations;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getMyReservations(id?: string) {
    try {
      const reservations = await Reservation.find().where({
        customerId: id,
      });
      return reservations;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addReservation(data: AddReservationBody) {
    try {
      const reservation = new Reservation(data);
      const savedReservation = await reservation.save();
      return savedReservation;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateReservation(id: string, data: Partial<IReservation>) {
    try {
      const result = await Reservation.findByIdAndUpdate(id, data);
      if (result) {
        result.save();
        const newReservation = await Reservation.findById(result._id);
        return newReservation;
      } else {
        throw new Error(errorMessages.incorectId);
      }
    } catch (error) {
      throw new Error(errorMessages.incorectId);
    }
  }

  async deleteReservation(id: string) {
    try {
      await Reservation.findByIdAndDelete(id);
      const allReservations = await Reservation.find()
        .populate("roomId")
        .populate("customerId");
      return allReservations;
    } catch (error) {
      throw new Error(errorMessages.incorectId);
    }
  }
}
