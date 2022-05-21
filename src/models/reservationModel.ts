import { model, Schema, Types } from "mongoose";
import { IReservationSceham } from "../types/reservationTypes";

const reservationSchema = new Schema<IReservationSceham>({
  customer: { type: Schema.Types.ObjectId, ref: "CustomerModel" },
  startTime: Schema.Types.Date,
  endTime: Schema.Types.Date,
  status: Schema.Types.String,
  days: Schema.Types.Number,
  cost: Schema.Types.Number,
  room: { type: Schema.Types.ObjectId, ref: "RoomModel" },
  cardNumber: Schema.Types.Number,
});

const Reservation = model<IReservationSceham>(
  "ReservationModel",
  reservationSchema
);

export default Reservation;
