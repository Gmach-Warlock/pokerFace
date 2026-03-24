import pg from "pg";
const { Pool } = pg;
import { type IUser } from "../types/express.js";

const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "poker_db",
  password: "your_password",
  port: 5432,
});

export const User = {
  // Find a user by ID (used by Passport deserializeUser)
  findById: async (id: number): Promise<IUser | null> => {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0] || null;
  },

  // Find a user by Username (used for Login)
  findByUsername: async (username: string): Promise<IUser | null> => {
    const res = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return res.rows[0] || null;
  },

  // Update currency (used after a game)
  updateCurrency: async (id: number, amount: number) => {
    await pool.query(
      "UPDATE users SET currency = currency + $1 WHERE id = $2",
      [amount, id],
    );
  },
};
