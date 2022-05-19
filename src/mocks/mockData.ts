import { IRoomInDatabase, RoomStandard } from "../types/roomTypes";

export const MOCK_ROOMS: IRoomInDatabase[] = [
    {
        _id: '1',
        beds: 3,
        floor: 1,
        number: 112,
        standard: RoomStandard.STANDARD
    },
    {
        _id: '2',
        beds: 2,
        floor: 4,
        number: 443,
        standard: RoomStandard.GOLD
    },
    {
        _id: '3',
        beds: 2,
        floor: 2,
        number: 223,
        standard: RoomStandard.PREMIUM
    }
]