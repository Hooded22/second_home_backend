import { Schema, model } from "mongoose";
import { IRoomSchema, RoomStandard } from "../types/roomTypes";

const roomSchema = new Schema<IRoomSchema>({
  number: Schema.Types.Number,
  floor: Schema.Types.Number,
  standard: { type: Schema.Types.String, default: RoomStandard.STANDARD },
  beds: Schema.Types.Number,
});

const Room = model<IRoomSchema>("RoomModel", roomSchema);

export default Room;
