import { MockDB } from "../mocks/db";
import request from "supertest";
import app from "../../app";
import Feedback from "./model";
import errorMessages from "../assets/errorMessages";
import { FeedbackStatusEnum } from "./types";

jest.mock("../auth/middleware", () =>
  jest.fn((req, res, next) => {
    next();
  })
);

const feedbackData = {
  title: "Mega",
  description: "Test1 description",
  rate: 5,
};

const feedbackAuthorData = {
  _id: "123",
  role: "manager",
  iat: 1655034408,
  firstName: "John",
  lastName: "Doe",
  userName: "John Doe",
};

describe("POST /feedback", () => {
  const mockGetFeedbackAuthor = jest.spyOn(
    Feedback.prototype,
    "getFeedbackAuthor"
  );
  const db = new MockDB();
  beforeAll(async () => {
    await db.setUp();
  });

  beforeEach(() => {
    mockGetFeedbackAuthor.mockImplementationOnce(() => feedbackAuthorData);
  });

  afterEach(async () => {
    await db.dropCollections();
    mockGetFeedbackAuthor.mockRestore();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });
  test("POST /feedback should return feedback data with author details", async () => {
    const result = await request(app)
      .post("/feedback")
      .send(feedbackData)
      .expect(200);

    expect(result.body._id).toBeTruthy();
    expect(result.body.author).toEqual(feedbackAuthorData);
  });
  test("POST /feedback should return error when author of feedback is not in db", async () => {
    mockGetFeedbackAuthor.mockRestore();

    const result = await request(app)
      .post("/feedback")
      .send(feedbackData)
      .expect(400);

    expect(result.body.error).toEqual(`Error: ${errorMessages.userNotFound}`);
  });
  test("POST /feedback should return error when data are incorect", async () => {
    const { title, ...feedbackWithoutTitle } = feedbackData;

    const result = await request(app)
      .post("/feedback")
      .send(feedbackWithoutTitle)
      .expect(400);

    expect(result.body.error).toEqual('ValidationError: "title" is required');
  });
  test("POST /confirm should return feedback with status changed to accepted", async () => {
    const feedbackInDB = await new Feedback(feedbackData).save();

    const result = await request(app)
      .post("/feedback/confirm")
      .send({ id: feedbackInDB._id })
      .expect(200);

    expect(result.body.status).toEqual(FeedbackStatusEnum.ACCEPTED);
  });
  test("POST /reject should return feedback with status changed to rejected", async () => {
    const feedbackInDB = await new Feedback(feedbackData).save();

    const result = await request(app)
      .post("/feedback/reject")
      .send({ id: feedbackInDB._id })
      .expect(200);

    expect(result.body.status).toEqual(FeedbackStatusEnum.REJECTED);
  });
});

describe("GET /feedback", () => {
  const mockGetFeedbackAuthor = jest.spyOn(
    Feedback.prototype,
    "getFeedbackAuthor"
  );
  const db = new MockDB();
  beforeAll(async () => {
    await db.setUp();
  });

  beforeEach(() => {
    mockGetFeedbackAuthor.mockImplementationOnce(() => feedbackAuthorData);
  });

  afterEach(async () => {
    await db.dropCollections();
    mockGetFeedbackAuthor.mockRestore();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });
  test("GET /feedback should return all feedbacks data", async () => {
    await new Feedback(feedbackData).save();

    const result = await request(app).get("/feedback").expect(200);

    expect(result.body).toHaveLength(1);
    expect(result.body[0]._id).toBeTruthy();
  });
});

describe("DELETE /feedback", () => {
  const db = new MockDB();
  beforeAll(async () => {
    await db.setUp();
  });

  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });
  test("DELETE /feedback should delete feedback from db", async () => {
    const feedbackInDB = await new Feedback(feedbackData).save();

    await request(app)
      .delete("/feedback")
      .query({ id: String(feedbackInDB._id) })
      .expect(200);

    const allFeedbacksInDb = await Feedback.find();

    expect(allFeedbacksInDb).toHaveLength(0);
  });
});
