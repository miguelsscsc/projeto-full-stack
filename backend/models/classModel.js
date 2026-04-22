import { query } from "../config/database.js";

export const listClasses = async () => {
  const { rows } = await query(
    `SELECT c.*,
      COUNT(DISTINCT s.id)::int AS subjects_count
     FROM classes c
     LEFT JOIN subjects s ON s.class_id = c.id
     GROUP BY c.id
     ORDER BY c.school_year DESC, c.name ASC`
  );
  return rows;
};

export const findClassById = async (id) => {
  const { rows } = await query("SELECT * FROM classes WHERE id = $1", [id]);
  return rows[0] || null;
};

export const createClass = async ({ name, school_year, shift, room }) => {
  const { rows } = await query(
    `INSERT INTO classes (name, school_year, shift, room)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, school_year, shift, room]
  );
  return rows[0];
};

export const updateClass = async (id, { name, school_year, shift, room }) => {
  const { rows } = await query(
    `UPDATE classes
     SET name = $1, school_year = $2, shift = $3, room = $4
     WHERE id = $5
     RETURNING *`,
    [name, school_year, shift, room, id]
  );
  return rows[0] || null;
};

export const deleteClass = async (id) => {
  await query("DELETE FROM classes WHERE id = $1", [id]);
};
