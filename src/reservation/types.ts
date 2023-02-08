import { Model } from "mongoose";
import { ICustomer } from "../customers/types";
import { IRoom } from "../room/types";

export enum ReservationStatuses {
  OPEN = "open",
  CLOSED = "closed",
  DELAYED = "delayd",
  CANCELED = "canceled",
}

export interface IReservation {
  customerId: string;
  startTime?: string;
  endTime: string;
  status: ReservationStatuses;
  cost: number;
  roomId: IRoom;
}

export interface AddReservationBody
  extends Required<Omit<IReservation, "roomId" | "status" | "cost">> {
  roomId: string;
}

export type IReservationUpdateData = Partial<Omit<IReservation, "status">>;

export type ReservationFilters = Partial<IReservation>;

export type ReservationResponse = Omit<IReservation, "cardNumber">;

export interface IReservationSceham extends IReservation, Document {
  calculateReservationDays(this: IReservationSceham): number;
}
