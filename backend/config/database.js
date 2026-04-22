import pkg from "pg";
import { env } from "./env.js";

const { Pool } = pkg;

export const pool = new Pool(env.database);

export const query = (text, params = []) => pool.query(text, params);
