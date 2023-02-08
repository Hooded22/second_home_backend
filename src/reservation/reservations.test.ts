import { MOCK_ROOMS } from "../mocks/mockData";
import ReservationModel from "./model";
import { AddReservationBody, IReservation, ReservationStatuses } from "./types";
import request from "supertest";
import app from "../../app";
import auth from "../auth/middleware";
import { UserRoles } from "../users/types";

const mockReservations: IReservation[] = [
  {
    customerId: "123",
    startTime: "2023-02-01T19:17:02.764Z",
    endTime: "2023-02-01T19:17:02.764Z",
    status: ReservationStatuses.DELAYED,
    cost: 200,
    roomId: MOCK_ROOMS[0],
  },
  {
    customerId: "124",
    startTime: "2023-02-01T19:17:02.764Z",
    endTime: "2023-02-01T19:17:02.764Z",
    status: ReservationStatuses.DELAYED,
    cost: 200,
    roomId: MOCK_ROOMS[0],
  },
  {
    customerId: "124",
    startTime: "2023-02-01T19:17:02.764Z",
    endTime: "2023-02-01T19:17:02.764Z",
    status: ReservationStatuses.DELAYED,
    cost: 200,
    roomId: MOCK_ROOMS[0],
  },
];

jest.mock("../auth/middleware", () =>
  jest.fn((req, res, next) => {
    req.user = { _id: "123", role: "manager", iat: 1655034408 };
    next();
  })
);

describe("Reservation CRUD", () => {
  beforeAll(() => {});
  describe("GET /reservation", () => {
    test("GET /reservation --> 200, all data", async () => {
      const mockFind = jest.spyOn(ReservationModel, "find");
      mockFind.mockImplementationOnce(
        () => ({ populate: () => mockReservations } as any)
      );

      const result = await request(app).get("/reservation").expect(200);

      expect(result.body).toEqual(mockReservations);
    });
    test("GET /reservation should call ReservationModel.where() with filters from query", async () => {
      const mockWhere = jest.fn(() => ({
        populate: () => ({ populate: () => [] }),
      }));
      const mockFind = jest
        .spyOn(ReservationModel, "find")
        .mockImplementationOnce(() => ({ where: mockWhere } as any));

      await request(app)
        .get("/reservation")
        .query({ someFilter: "123" })
        .expect(200);

      expect(mockWhere).toHaveBeenCalledWith({ someFilter: "123" });

      mockWhere.mockReset();
      mockFind.mockReset();
    });
    test("GET /reservation by user with 'customer' role --> 403, permission denied", async () => {
      (auth as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = { _id: "123", role: UserRoles.CUSTOMER, iat: 1655034408 };
        next();
      });

      const mockFind = jest.spyOn(ReservationModel, "find");
      mockFind.mockImplementationOnce(
        () => ({ populate: () => mockReservations } as any)
      );

      const result = await request(app).get("/reservation").expect(403);

      expect(result.body.error).toEqual("Error: Permission denied");

      mockFind.mockReset();
    });
    test("GET /reservation/myReservations by user with 'customer' role should call ReservationModel.where() with user id", async () => {
      (auth as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = { _id: "123", role: UserRoles.CUSTOMER, iat: 1655034408 };
        next();
      });

      const mockWhere = jest.fn(() => []);
      jest
        .spyOn(ReservationModel, "find")
        .mockImplementationOnce(() => ({ where: mockWhere } as any));

      await request(app)
        .get("/reservation/myReservations")
        .query({ someFilter: "123" })
        .expect(200);

      expect(mockWhere).toHaveBeenCalledWith({ customerId: "123" });
    });
  });
  describe("POST /reservation", () => {
    test("POST /reservation/ with correct data should retrun data of added reservation", async () => {
      const mockSave = jest.spyOn(ReservationModel.prototype, "save");
      const dataToAdd: AddReservationBody = {
        customerId: "123",
        endTime: "2022-06-12T18:00:00",
        startTime: "2022-06-10T18:00:00",
        roomId: "123",
      };

      mockSave.mockReturnValueOnce(dataToAdd);

      const result = await request(app)
        .post("/reservation")
        .set("Content-Type", "application/json")
        .send(dataToAdd)
        .expect(200);

      expect(result.body).toEqual(dataToAdd);

      mockSave.mockReset();
    });

    test("POST /reservation with incorect data should return 400 and error message", async () => {
      const dataToAdd = {
        endTime: "2022-06-12T18:00:00",
        startTime: "2022-06-10T18:00:00",
        roomId: "123",
      };
      const mockSave = jest.spyOn(ReservationModel.prototype, "save");

      mockSave.mockReturnValueOnce(dataToAdd);

      const result = await request(app)
        .post("/reservation")
        .set("Content-Type", "application/json")
        .send(dataToAdd)
        .expect(400);

      expect(result.body.error).toEqual('Error: "customerId" is required');
    });
  });
  describe("PUT /reservation", () => {
    test("PUT /reservation should call ReservationModel.findByIdAndUpdate() with id and data", async () => {
      const mockReservationNewData = {
        startTime: "2022-06-10T18:00:00",
      };

      const mockfindByIdAndUpdate = jest.spyOn(
        ReservationModel,
        "findByIdAndUpdate"
      );
      const mockfindById = jest.spyOn(ReservationModel, "findById");

      mockfindByIdAndUpdate.mockImplementationOnce(
        () => ({ save: jest.fn() } as any)
      );
      mockfindById.mockImplementation(() => true as any);

      await request(app)
        .put("/reservation")
        .set("Content-Type", "application/json")
        .send(mockReservationNewData)
        .query({ id: "123" });

      expect(mockfindByIdAndUpdate).toBeCalledWith(
        "123",
        mockReservationNewData
      );

      mockfindById.mockReset();
      mockfindByIdAndUpdate.mockReset();
    });
    test("PUT /reservation with id and data shoudl return status 200", async () => {
      const mockReservationNewData = {
        startTime: "2022-06-10T18:00:00",
      };

      const mockfindByIdAndUpdate = jest.spyOn(
        ReservationModel,
        "findByIdAndUpdate"
      );
      const mockfindById = jest.spyOn(ReservationModel, "findById");

      mockfindByIdAndUpdate.mockImplementationOnce(
        () => ({ save: jest.fn() } as any)
      );
      mockfindById.mockImplementation(() => true as any);

      await request(app)
        .put("/reservation")
        .set("Content-Type", "application/json")
        .send(mockReservationNewData)
        .query({ id: "123" })
        .expect(200);

      mockfindById.mockReset();
      mockfindByIdAndUpdate.mockReset();
    });
    test("PUT /reservation shoudl return 400 and error message when error occures", async () => {
      const mockfindByIdAndUpdate = jest.spyOn(
        ReservationModel,
        "findByIdAndUpdate"
      );
      const mockfindById = jest.spyOn(ReservationModel, "findById");

      mockfindByIdAndUpdate.mockImplementationOnce(() => false as any);
      mockfindById.mockImplementation(() => true as any);

      const result = await request(app)
        .put("/reservation")
        .set("Content-Type", "application/json")
        .expect(400);

      expect(result.body.error).toEqual(
        "Incorect id. Item with this it don't exist in database"
      );

      mockfindById.mockReset();
      mockfindByIdAndUpdate.mockReset();
    });
  });
  describe("DELETE /reservation", () => {
    test("DELETE /reservation shoudl return status code 200 and call ReservationModel.findByIdAndDelete() with reservation id", async () => {
      const mockFindByIdAndDelete = jest.spyOn(
        ReservationModel,
        "findByIdAndDelete"
      );
      const mockFind = jest.spyOn(ReservationModel, "find");

      mockFindByIdAndDelete.mockImplementationOnce(() => true as any);
      mockFind.mockImplementationOnce(
        () =>
          ({
            populate: () => ({
              populate: () => true,
            }),
          } as any)
      );

      await request(app)
        .delete("/reservation")
        .query({ id: "123" })
        .expect(200);

      expect(mockFindByIdAndDelete).toHaveBeenCalledWith("123");

      mockFindByIdAndDelete.mockReset();
      mockFind.mockReset();
    });
  });
});

describe("Reservation model", () => {});
describe("Reservation validator", () => {});
