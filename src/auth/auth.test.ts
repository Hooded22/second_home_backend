import { MockDB } from "../mocks/db";
import request from "supertest";
import app from "../../app";
import User from "../users/model";

jest.mock("./middleware", () =>
  jest.fn((req, res, next) => {
    next();
  })
);

const userData = {
  firstName: "Mike",
  lastName: "Black",
  email: "m.black@mb.com",
  password: "Test12345",
};

const userLoginData = {
  email: userData.email,
  password: userData.password,
};

describe("Registration", () => {
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
  test("POST /registration should return user data with userName and id and status code 200", async () => {
    const result = await request(app)
      .post("/auth/registration")
      .send(userData)
      .expect(200);

    expect(result.body._id).toBeTruthy();
    expect(result.body.userName).toEqual("Mike Black");
  });
  it("POST /registration should return error message and status code 400 when data are incorect", async () => {
    const { email, ...userDataWihtoutEmail } = userData;

    const result = await request(app)
      .post("/auth/registration")
      .send(userDataWihtoutEmail)
      .expect(400);

    expect(result.body.error).toEqual('ValidationError: "email" is required');
  });
  it("POST /registration should return error message and status code 400 when user with e-mail already exists", async () => {
    await new User({ ...userData, userName: "Mike Black" }).save();

    const result = await request(app)
      .post("/auth/registration")
      .send(userData)
      .expect(400);

    expect(result.body.error).toEqual(
      "User with this email exists in data base"
    );
  });
});

describe("Login", () => {
  async function registerSampleUser() {
    return await request(app)
      .post("/auth/registration")
      .send(userData)
      .expect(200);
  }
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
  test("POST /login should return token and user details woth code 200", async () => {
    await registerSampleUser();

    const result = await request(app)
      .post("/auth/login")
      .send(userLoginData)
      .expect(200);

    expect(result.body.token).toBeTruthy();
    expect(result.body.userDetails).toBeTruthy();
  });
  test("POST /login should update user in db adding token", async () => {
    await registerSampleUser();

    const result = await request(app)
      .post("/auth/login")
      .send(userLoginData)
      .expect(200);
    const userInDb = await User.findById(result.body.userDetails._id);

    expect(userInDb?.token).toBeTruthy();
  });
  test("POST /login should return error when email has incorect format", async () => {
    await registerSampleUser();
    const userLoginDataWithIncorectEmailFormt = {
      ...userLoginData,
      email: "wrongEmail",
    };

    const result = await request(app)
      .post("/auth/login")
      .send(userLoginDataWithIncorectEmailFormt)
      .expect(400);

    expect(result.body.error).toEqual(
      'ValidationError: "email" must be a valid email'
    );
  });
  it("POST /login should return error when email doesn't exist in db", async () => {
    const result = await request(app)
      .post("/auth/login")
      .send(userLoginData)
      .expect(400);

    expect(result.body.error).toEqual("Email or password is wrong");
  });
  test("POST /login should return error when password is incorect for email in db", async () => {
    await registerSampleUser();
    const userLoginDataWithIncorectPassword = {
      ...userLoginData,
      password: "123",
    };

    const result = await request(app)
      .post("/auth/login")
      .send(userLoginDataWithIncorectPassword)
      .expect(400);

    expect(result.body.error).toEqual("Email or password is wrong");
  });
});
