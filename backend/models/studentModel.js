import { query } from "../config/database.js";

const studentSelect = `
  SELECT
    s.id,
    s.user_id,
    s.class_id,
    s.registration_number,
    s.birth_date,
    s.guardian_name,
    s.created_at,
    u.name,
    u.email,
    c.name AS class_name,
    c.school_year
  FROM students s
  JOIN users u ON u.id = s.user_id
  LEFT JOIN classes c ON c.id = s.class_id
`;

export const listStudents = async () => {
  const { rows } = await query(`${studentSelect} ORDER BY s.created_at DESC`);
  return rows;
};

export const findStudentById = async (id) => {
  const { rows } = await query(`${studentSelect} WHERE s.id = $1`, [id]);
  return rows[0] || null;
};

export const findStudentByUserId = async (userId) => {
  const { rows } = await query(`${studentSelect} WHERE s.user_id = $1`, [userId]);
  return rows[0] || null;
};

export const findStudentByRegistration = async (registrationNumber) => {
  const { rows } = await query(
    "SELECT id FROM students WHERE registration_number = $1",
    [registrationNumber]
  );
  return rows[0] || null;
};

export const createStudent = async ({
  user_id,
  class_id,
  registration_number,
  birth_date,
  guardian_name,
}) => {
  const { rows } = await query(
    `INSERT INTO students (user_id, class_id, registration_number, birth_date, guardian_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [user_id, class_id || null, registration_number, birth_date || null, guardian_name || null]
  );

  return findStudentById(rows[0].id);
};

export const updateStudent = async (
  id,
  { user_id, class_id, registration_number, birth_date, guardian_name }
) => {
  const { rows } = await query(
    `UPDATE students
     SET user_id = $1,
         class_id = $2,
         registration_number = $3,
         birth_date = $4,
         guardian_name = $5
     WHERE id = $6
     RETURNING id`,
    [user_id, class_id || null, registration_number, birth_date || null, guardian_name || null, id]
  );

  if (!rows[0]) {
    return null;
  }

  return findStudentById(id);
};

export const deleteStudent = async (id) => {
  await query("DELETE FROM students WHERE id = $1", [id]);
};
