import express from "express";
// import { execSync } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { getUserIdByMailAndPassword } from "../users/repository";
import {
  getSessionByUserId,
  createSession,
  getSessionBySessionId,
  deleteSessions,
} from "./repository";
import crypto from 'crypto';

export const sessionRouter = express.Router();

// ログインAPI
sessionRouter.post(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (
      !req.body.mail ||
      typeof req.body.mail !== "string" ||
      !req.body.password ||
      typeof req.body.password !== "string"
    ) {
      res.status(400).json({
        message: "メールアドレスとパスワードを文字列で入力してください。",
      });
      console.warn("email or password is empty or not string");
      return;
    }

    const { mail, password }: { mail: string; password: string } = req.body;

    const hashPassword = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
		console.log(hashPassword);
    try {
      const userId = await getUserIdByMailAndPassword(mail, hashPassword); //creat indexで100倍速くなった
      if (!userId) {
        res.status(401).json({
          message: "メールアドレスまたはパスワードが正しくありません。",
        });
        console.warn("email or password is invalid");
        return;
      }

      const session = await getSessionByUserId(userId);
      if (session !== undefined) {
        res.cookie("SESSION_ID", session.sessionId, {
          httpOnly: true,
          path: "/",
        });
        res.json(session);
        console.log("user already logged in");
        return;
      }

      const sessionId = uuidv4();
      await createSession(sessionId, userId, new Date()); //INSERTをやっている
      const createdSession = await getSessionBySessionId(sessionId); //速い
      if (!createdSession) {
        res.status(500).json({
          message: "ログインに失敗しました。",
        });
        console.error("failed to insert session");
        return;
      }

      res.cookie("SESSION_ID", createdSession.sessionId, {
        httpOnly: true,
        path: "/",
      });
      res.status(201).json(createdSession);
      console.log("successfully logged in");
    } catch (e) {
      next(e);
    }
  }
);

// ログアウトAPI
sessionRouter.delete(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.headers["X-DA-USER-ID"] as string;

      await deleteSessions(userId);
      res.clearCookie("SESSION_ID", { httpOnly: true, path: "/" });
      res.status(204).send();
      console.log("successfully logged out");
    } catch (e) {
      next(e);
    }
  }
);
