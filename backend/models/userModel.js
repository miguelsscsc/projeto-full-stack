import { query } from "../config/database.js";

export const listUsers = async () => {
  const { rows } = await query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return rows;
};

export const findUserByEmail = async (email) => {
  const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const { rows } = await query(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

export const findUserAuthByEmail = async (email) => {
  const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
};

export const createUser = async ({ name, email, password, role }) => {
  const { rows } = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, password, role]
  );
  return rows[0];
};

export const updateUser = async (id, { name, email, password, role }) => {
  const { rows } = await query(
    `UPDATE users
     SET name = $1, email = $2, password = $3, role = $4
     WHERE id = $5
     RETURNING id, name, email, role, created_at`,
    [name, email, password, role, id]
  );
  return rows[0] || null;
};

export const deleteUser = async (id) => {
  await query("DELETE FROM users WHERE id = $1", [id]);
};
