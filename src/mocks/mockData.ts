import { IReservation } from "../types/reservationTypes";
import { IRoomInDatabase, RoomStandard } from "../rooms/roomTypes";

export const MOCK_ROOMS: IRoomInDatabase[] = [
  {
    _id: "1",
    beds: 3,
    floor: 1,
    number: 112,
    price: 100,
    standard: RoomStandard.STANDARD,
  },
  {
    _id: "2",
    beds: 2,
    floor: 4,
    number: 443,
    price: 100,
    standard: RoomStandard.GOLD,
  },
  {
    _id: "3",
    beds: 2,
    floor: 2,
    number: 223,
    price: 100,
    standard: RoomStandard.PREMIUM,
  },
];
