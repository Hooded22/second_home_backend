import { ICustomer } from "./customerTypes";
import { IRoom } from "./roomTypes";

export enum ReservationStatuses {
  OPEN = "open",
  CLOSED = "closed",
  DELAYED = "delayd",
  CANCELED = "canceled",
}

export interface IReservation {
  customerId: string;
  startTime: Date;
  endTime: Date | null;
  status: ReservationStatuses;
  days: number;
  cost: number;
  roomId: IRoom;
  cardNumber: number;
}

export type IReservationUpdateData = Partial<Omit<IReservation, "status">>;

export type ReservationFilters = Partial<IReservation>;

export type ReservationResponse = Omit<IReservation, "cardNumber">;

export interface IReservationSceham extends IReservation, Document {}
