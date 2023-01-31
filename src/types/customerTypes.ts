import { IReservation } from "./reservationTypes";

export interface ICustomer {
  name: string;
  lastName: string;
  birthDate: Date;
}

export interface ICustomerSchema extends ICustomer, Document {}
export interface CustomerWithReservations extends ICustomer {
  reservations?: IReservation[];
}
