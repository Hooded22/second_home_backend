enum RoomStadard {
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM",
    GOLD = "GOLD"
}


export interface IRoom {
    number: number,
    floor: number,
    standard: RoomStadard,
    beds: number,
}

export interface IRoomSchema extends IRoom, Document {}