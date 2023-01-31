export enum RoomStandard {
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM",
  GOLD = "GOLD",
}

type RoomPrice = number;

export interface IRoom {
  number: number;
  price: RoomPrice;
  floor: number;
  standard: RoomStandard;
  beds: number;
}

export interface IRoomInDatabase extends IRoom {
  _id: string;
}

export interface IRoomSchema extends IRoom, Document {}
