import { Request, Response, NextFunction } from "express";
import { isEmpty } from "lodash";
import errorMessages from "../assets/errorMessages";
import { successMessages } from "../assets/successMessages";
import Room from "./model";
import RoomModel from "./model";
import { IRoom } from "./types";
import { addRoomValidator } from "./validation";

export default class RoomController {
  async addRoom(roomToAdd: IRoom) {
    try {
      const room = new Room(roomToAdd);
      const savedRoom = await room.save();
      return savedRoom;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getRoom() {
    try {
      const rooms = await Room.find();
      if (isEmpty(rooms)) {
        return [];
      }
      return rooms;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateRoom(id: string, newRoomData: Partial<IRoom>) {
    try {
      const result = await Room.findByIdAndUpdate(id, newRoomData);
      if (result) {
        const newRoom = await Room.findById(result._id);
        return newRoom;
      } else {
        throw new Error(errorMessages.incorectId);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleteRoom(id: string) {
    try {
      await Room.findByIdAndDelete(id);
      return successMessages.deleted;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
