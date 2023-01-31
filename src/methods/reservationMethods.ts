import { DateTime } from "luxon";
import {
  IReservation,
  IReservationSceham,
  ReservationResponse,
} from "../reservation/types";

export function calculateReservationDays(this: IReservationSceham): number {
  return DateTime.fromJSDate(this.endTime).diff(
    DateTime.fromJSDate(this.startTime || new Date()),
    "days"
  ).days;
}
