import axios from "axios";
import { RowDataPacket } from "mysql2";
import pool from "./e2e";
import sharp from "sharp";

const BASE_URL = process.env.BASE_URL;

afterAll(async () => {
  await pool.end();
});

describe("Get User Icon API", () => {
  test("OK", async () => {
    console.log(new Date(), "start testing the Get User Icon API");
    const [userIconIdRow] = await pool.query<RowDataPacket[]>(
      "SELECT user_icon_id \
			FROM user \
			JOIN (SELECT ROUND(RAND() * (SELECT MAX(user_id) FROM user)) AS random_id) AS r \
			WHERE user.user_id >= r.random_id \
			ORDER BY user.user_id \
			LIMIT 1;"
    );
    const [fileNameRow] = await pool.query<RowDataPacket[]>(
      "SELECT file_name FROM file WHERE file_id = ?",
      [userIconIdRow[0].user_icon_id]
    );

    const res = await axios.get(
      `${BASE_URL}/api/v1/users/user-icon/${userIconIdRow[0].user_icon_id}`,
      {
        headers: {
          Cookie: "SESSION_ID=test-session-id; Path=/; HttpOnly",
        },
      }
    );

    const metadata = await sharp(
      Buffer.from(res.data.data, "base64")
    ).metadata();
    const { width, height } = metadata;

    expect(200).toBe(res.status);
    expect(fileNameRow[0].file_name).toBe(res.data.fileName);
    expect(500).toBe(width);
    expect(500).toBe(height);
    console.log(new Date(), "end testing the Get User Icon API");
  });
});
