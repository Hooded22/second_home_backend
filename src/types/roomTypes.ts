export enum RoomStandard {
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM",
    GOLD = "GOLD"
}


export interface IRoom {
    number: number,
    floor: number,
    standard: RoomStandard,
    beds: number,
}

export interface IRoomInDatabase extends IRoom {
    id: string;
}

export interface IRoomSchema extends IRoom, Document {}