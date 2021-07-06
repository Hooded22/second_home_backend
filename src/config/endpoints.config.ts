import * as dotenv from "dotenv";
dotenv.config();

export const DB_URL = process.env.DB_CONNECTION || "";
