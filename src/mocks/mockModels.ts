import { IRoomInDatabase, RoomStandard } from "../types/roomTypes";
import { MOCK_ROOMS } from "./mockData";

class DefaultModel {
  constructor(data: {}) {
    this.save = this.save;
    this.data = data;
  }

  data = {};

  static find = jest.fn();
  static findOne = jest.fn();
  static findById = jest.fn();
  static findByIdAndDelete = jest.fn();
  save = jest.fn(() => this.data);
}

export class MockRoomModel extends DefaultModel {
  constructor(data: {}) {
    super(data);
  }

  static find = jest.fn(() => MOCK_ROOMS);
  static findOne = jest.fn(() => null);
  static findById = jest.fn((id) => MOCK_ROOMS.find((item) => item._id === id));
}
