import { text } from "express";
import request from "supertest";
import app from "../app";
import errorMessages from "../src/assets/errorMessages";
import { MOCK_ROOMS } from "../src/mocks/mockData";
import RoomModel from "../src/room/model";
import { IRoom, RoomStandard } from "../src/room/types";

jest.mock("../src/auth/middleware", () =>
  jest.fn((req, res, next) => {
    next();
  })
);

jest.mock("../src/room/model", () => {
  const { MockRoomModel } = require("../src/mocks/mockModels");

  return MockRoomModel;
});

// jest.setTimeout(10000);

describe("Rooms", () => {
  describe("GET /room", () => {
    test("GET /room should return array of rooms", async () => {
      const mockRoomFind = jest.spyOn(RoomModel, "find");
      mockRoomFind.mockImplementationOnce(() => MOCK_ROOMS as any);

      const response = await request(app).get("/room").expect(200);
      expect(response.body).toEqual(MOCK_ROOMS);
    });

    test("GET /room return error when find() is rejected", async () => {
      const mockRoomFind = jest.spyOn(RoomModel, "find");
      mockRoomFind.mockRejectedValueOnce({ error: "Test error" });

      const response = await request(app).get("/room").expect(400);

      expect(response.body.error).toEqual(errorMessages.findError);
    });

    test("GET /room shoudl return empty array when data dont exist", async () => {
      const mockRoomFind = jest.spyOn(RoomModel, "find");
      mockRoomFind.mockReturnValueOnce([] as any);

      const response = await request(app).get("/room").expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe("POST /room", () => {
    test("POST /room should return new added room", async () => {
      const postData: IRoom = {
        beds: 2,
        floor: 2,
        number: 226,
        price: 100,
        standard: RoomStandard.PREMIUM,
      };
      const response = await request(app)
        .post("/room")
        .set("Content-Type", "application/json")
        .send(postData)
        .expect(200);

      expect(response.body).toEqual(postData);
    });

    test("POST /room should return error when room with number already exist", async () => {
      const mockRoomFindOne = jest.spyOn(RoomModel, "findOne");
      mockRoomFindOne.mockReturnValueOnce(MOCK_ROOMS[0] as any);
      const postData: IRoom = {
        beds: 2,
        floor: 2,
        price: 100,
        number: MOCK_ROOMS[0].number,
        standard: RoomStandard.PREMIUM,
      };
      const response = await request(app)
        .post("/room")
        .set("Content-Type", "application/json")
        .send(postData)
        .expect(400);
      expect(response.body.error).toEqual(
        errorMessages.roomWithNumberAlreadyExist
      );
    });

    test("POST /room should return error when any of require data doesnt exist", async () => {
      const postData = {
        beds: 2,
        number: 312,
        standard: RoomStandard.PREMIUM,
      };
      const response = await request(app)
        .post("/room")
        .set("Content-Type", "application/json")
        .send(postData)
        .expect(400);
      expect(response.body.error).toEqual('"floor" is required');
    });
  });

  describe("DELETE /room", () => {
    test("DELETE /room should call findByIdAndDelete method with id of item", async () => {
      const mockRoomFindByIdAndDelete = jest.spyOn(
        RoomModel,
        "findByIdAndDelete"
      );
      const id = "123";

      const response = await request(app)
        .delete("/room")
        .query({ id: id })
        .expect(200);

      expect(mockRoomFindByIdAndDelete).toHaveBeenCalledWith(id);
      expect(response.body).toEqual("Deleted succesfully!");
    });

    test("DELETE /room should return error when id not exist", async () => {
      const mockRoomFindByIdAndDelete = jest
        .spyOn(RoomModel, "findByIdAndDelete")
        .mockReset();

      const response = await request(app)
        .delete("/room")
        .query({ id: undefined })
        .expect(404);

      expect(mockRoomFindByIdAndDelete).not.toHaveBeenCalled();
      expect(response.body.error).toEqual(errorMessages.incorectId);
    });

    test("DELETE /room should return error when findByIdAndDelete throw error", async () => {
      const mockRoomFindByIdAndDelete = jest.spyOn(
        RoomModel,
        "findByIdAndDelete"
      );
      mockRoomFindByIdAndDelete.mockRejectedValueOnce("Error");

      const response = await request(app)
        .delete("/room")
        .query({ id: "123" })
        .expect(400);

      expect(mockRoomFindByIdAndDelete).toHaveBeenCalled();
      expect(response.body.error).toEqual(errorMessages.incorectId);
    });
  });
});
