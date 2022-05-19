import { ICustomer } from "./customerTypes";
import { IRoom } from "./roomTypes";

enum ReservationStatuses {
  OPEN = "",
  CLOSED = "",
  DELAYED = "",
  CANCELED = "",
}

export interface IReservation {
  customer: ICustomer;
  startTime: Date;
  endTime: Date | null;
  status: ReservationStatuses;
  days: number;
  cost: number;
  room: IRoom;
  cardNumber: number;
}

export type ReservationResponse = Omit<IReservation, "cardNumber">;

export interface IReservationSceham extends IReservation, Document {}
