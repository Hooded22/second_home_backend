import { DateTime } from "luxon";
import { IReservation, IReservationSceham, ReservationResponse } from "./types";

export function calculateReservationDays(this: IReservationSceham): number {
  const startTime = this.startTime
    ? DateTime.fromJSDate(new Date(this.startTime))
    : DateTime.now();
  const reservationDays = DateTime.fromJSDate(new Date(this.endTime)).diff(
    startTime,
    "days"
  ).days;

  if (reservationDays < 0) {
    throw new Error("Start time cannot be later than end time");
  }

  return reservationDays;
}
