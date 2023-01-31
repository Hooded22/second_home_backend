import { NextFunction } from "express";
import { model, Schema, Types, ObjectId } from "mongoose";
import { DEFAULT_PRICE_FOR_NIGHT } from "../assets/constants";
import { calculateReservationDays } from "../methods/reservationMethods";
import { IReservation, IReservationSceham, ReservationStatuses } from "./types";
import RoomModel from "../room/model";

const reservationSchema = new Schema<IReservationSceham>({
  customerId: { type: Schema.Types.ObjectId, ref: "CustomerModel" },
  startTime: Schema.Types.Date,
  endTime: Schema.Types.Date,
  status: { type: Schema.Types.String, default: ReservationStatuses.OPEN },
  cost: Schema.Types.Number,
  roomId: { type: Schema.Types.ObjectId, ref: "RoomModel" },
});

reservationSchema.methods.calculateReservationDays = calculateReservationDays;

reservationSchema.pre<IReservationSceham>("save", async function (next: any) {
  const reservation = this;
  try {
    const room = await RoomModel.findById(reservation.roomId);
    const days = this.calculateReservationDays();
    const cost = room ? room.price * days : DEFAULT_PRICE_FOR_NIGHT * days;
    this.cost = Math.round(cost);
  } catch (e: any) {
    console.log(e);
  } finally {
    next();
  }
});

reservationSchema.pre<IReservationSceham>(
  "updateOne",
  async function (next: any) {
    const reservation = this;
    try {
      const room = await RoomModel.findById(reservation.roomId);
      const days = this.calculateReservationDays();
      const cost = room ? room.price * days : DEFAULT_PRICE_FOR_NIGHT * days;
      this.cost = Math.round(cost);
    } catch (e: any) {
      console.log(e);
    } finally {
      next();
    }
  }
);

const Reservation = model<IReservationSceham>(
  "ReservationModel",
  reservationSchema
);

export default Reservation;
