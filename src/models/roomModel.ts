import { Schema, model } from "mongoose";
import { IRoomSchema } from "../types/roomTypes";

const roomSchema = new Schema<IRoomSchema>({

});

const Room = model<IRoomSchema>("RoomModel", roomSchema);

export default Room;