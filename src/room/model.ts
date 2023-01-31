import { Schema, model } from "mongoose";
import { DEFAULT_PRICE_FOR_NIGHT } from "../assets/constants";
import { IRoomSchema, RoomStandard } from "./types";

const roomSchema = new Schema<IRoomSchema>({
  number: Schema.Types.Number,
  floor: Schema.Types.Number,
  standard: { type: Schema.Types.String, default: RoomStandard.STANDARD },
  beds: Schema.Types.Number,
  price: { type: Schema.Types.Number, default: DEFAULT_PRICE_FOR_NIGHT },
});

const Room = model<IRoomSchema>("RoomModel", roomSchema);

export default Room;
