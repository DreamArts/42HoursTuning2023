import express from "express";
import request from "supertest";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { app } from "../../app";
import { getUserIdByMailAndPassword } from "../users/repository";
import {
  getSessionByUserId,
  createSession,
  getSessionBySessionId,
  deleteSessions,
} from "./repository";
import {
  mockUserId,
  mockSessionId,
  mockSession,
  mockLoginUser,
  mockDate,
} from "../../model/mock";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("../users/repository", () => ({
  getUserIdByMailAndPassword: jest.fn(),
}));

jest.mock("./repository", () => ({
  getSessionByUserId: jest.fn(),
  createSession: jest.fn(),
  getSessionBySessionId: jest.fn(),
  deleteSessions: jest.fn(),
}));

jest.mock("../../middleware/auth", () => ({
  checkAuthMiddleware: (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    req.headers["X-DA-USER-ID"] = mockLoginUser.userId;
    next();
  },
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe("POST /api/v1/session", () => {
  const mail = "mail";
  const password = "password";

  const hash = crypto.createHash("sha256");
  hash.update("password");
  const hashPassword = hash.digest("hex");

  test("OK: 201", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  
    (uuidv4 as jest.Mock).mockReturnValue(mockSessionId);
    (getUserIdByMailAndPassword as jest.Mock).mockReturnValue(mockUserId);
    (getSessionByUserId as jest.Mock).mockReturnValue(undefined);
    (getSessionBySessionId as jest.Mock).mockReturnValue(mockSession);
  
    // Rest of your test code...
    const res = await request(app)
    .post("/api/v1/session")
    .send({
      mail,
      password,
    })
    .set("Content-Type", "application/json");
    const cookies = res.header["set-cookie"][0];
    const sessionIdCookies = cookies
    .split(";")
    .find((cookie: string) => cookie.startsWith("SESSION_ID="));
    
    expect(res.status).toBe(201);
    expect(sessionIdCookies).toBe("SESSION_ID=sessionId");
    expect(res.body).toEqual(mockSession);
    expect(mockGetUserIdByMailAndPassword).toHaveBeenCalledWith(
      mail,
      hashPassword
      );
      expect(mockGetSessionByUserId).toHaveBeenCalledWith(mockUserId);
      expect(createSession).toHaveBeenCalledWith(
        mockSessionId,
        mockUserId,
        mockDate
        );
        expect(mockGetSessionBySessionId).toHaveBeenCalledWith(
          mockSession.sessionId
          );
          jest.useRealTimers();
    });
        
  test("OK: 200", async () => {
    const mockGetUserIdByMailAndPassword =
      getUserIdByMailAndPassword as jest.Mock;
    mockGetUserIdByMailAndPassword.mockReturnValue(mockUserId);

    const mockGetSessionByUserId = getSessionByUserId as jest.Mock;
    mockGetSessionByUserId.mockReturnValue(mockSession);

    const res = await request(app)
      .post("/api/v1/session")
      .send({
        mail,
        password,
      })
      .set("Content-Type", "application/json");
    const cookies = res.header["set-cookie"][0];
    const sessionIdCookies = cookies
      .split(";")
      .find((cookie: string) => cookie.startsWith("SESSION_ID="));

    expect(res.status).toBe(200);
    expect(sessionIdCookies).toBe("SESSION_ID=sessionId");
    expect(res.body).toEqual(mockSession);
    expect(mockGetUserIdByMailAndPassword).toHaveBeenCalledWith(
      mail,
      hashPassword
    );
    expect(mockGetSessionByUserId).toHaveBeenCalledWith(mockUserId);
  });

  test("NG: login info invalid", async () => {
    const mockGetUserIdByMailAndPassword =
      getUserIdByMailAndPassword as jest.Mock;
    mockGetUserIdByMailAndPassword.mockReturnValue(undefined);

    const res = await request(app)
      .post("/api/v1/session")
      .send({
        mail: "invalid",
        password,
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "メールアドレスまたはパスワードが正しくありません。",
    });
    expect(mockGetUserIdByMailAndPassword).toHaveBeenCalledWith(
      "invalid",
      hashPassword
    );
  });

  test("NG: request body empty", async () => {
    const res = await request(app)
      .post("/api/v1/session")
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "メールアドレスとパスワードを文字列で入力してください。",
    });
  });

  test("NG: mail empty", async () => {
    const res = await request(app)
      .post("/api/v1/session")
      .send({
        password,
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "メールアドレスとパスワードを文字列で入力してください。",
    });
  });

  test("NG: password empty", async () => {
    const res = await request(app)
      .post("/api/v1/session")
      .send({
        mail,
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "メールアドレスとパスワードを文字列で入力してください。",
    });
  });

  test("NG: request body not json format", async () => {
    const res = await request(app)
      .post("/api/v1/session")
      .send('{"invalid"}')
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "リクエストボディがJSON形式ではありません。",
    });
  });

  test("NG: unexpected error occurred", async () => {
    const mockGetUserIdByMailAndPassword =
      getUserIdByMailAndPassword as jest.Mock;
    mockGetUserIdByMailAndPassword.mockImplementation(() => {
      throw new Error();
    });

    const res = await request(app)
      .post("/api/v1/session")
      .send({
        mail,
        password,
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Internal Server Error" });
    expect(mockGetUserIdByMailAndPassword).toHaveBeenCalledWith(
      mail,
      hashPassword
    );
  });
});

describe("DELETE /api/v1/session", () => {
  test("OK", async () => {
    const res = await request(app)
      .delete("/api/v1/session")
      .set("Cookie", "SESSION_ID=test");
    const cookies = res.header["set-cookie"][0];
    const sessionIdCookies = cookies
      .split(";")
      .find((cookie: string) => cookie.startsWith("SESSION_ID="));

    expect(res.status).toBe(204);
    expect(sessionIdCookies).toBe("SESSION_ID=");
    expect(deleteSessions).toHaveBeenCalledWith(mockLoginUser.userId);
  });

  test("NG: unexpected error occurred", async () => {
    const mockDeleteSessions = deleteSessions as jest.Mock;
    mockDeleteSessions.mockImplementation(() => {
      throw new Error();
    });

    const res = await request(app).delete("/api/v1/session");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Internal Server Error" });
    expect(deleteSessions).toHaveBeenCalledWith(mockLoginUser.userId);
  });
});
