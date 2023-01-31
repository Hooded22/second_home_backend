import { Model } from "mongoose";
import { ICustomer } from "../types/customerTypes";
import { IRoom } from "../room/types";

export enum ReservationStatuses {
  OPEN = "open",
  CLOSED = "closed",
  DELAYED = "delayd",
  CANCELED = "canceled",
}

export interface IReservation {
  customerId: string;
  startTime?: Date;
  endTime: Date;
  status: ReservationStatuses;
  cost: number;
  roomId: IRoom;
}

export type IReservationUpdateData = Partial<Omit<IReservation, "status">>;

export type ReservationFilters = Partial<IReservation>;

export type ReservationResponse = Omit<IReservation, "cardNumber">;

export interface IReservationSceham extends IReservation, Document {
  calculateReservationDays(this: IReservationSceham): number;
}
