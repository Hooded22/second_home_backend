import { DateTime } from "luxon";
import { IReservation, IReservationSceham, ReservationResponse } from "./types";

export function calculateReservationDays(this: IReservationSceham): number {
  return DateTime.fromISO(this.endTime).diff(
    DateTime.fromISO(this.startTime || DateTime.now().toISO()),
    "days"
  ).days;
}
