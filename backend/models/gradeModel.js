import { query } from "../config/database.js";

const gradeSelect = `
  SELECT
    g.id,
    g.enrollment_id,
    g.title,
    g.score,
    g.weight,
    g.created_at,
    e.student_id,
    subject.name AS subject_name,
    student_user.name AS student_name
  FROM grades g
  JOIN enrollments e ON e.id = g.enrollment_id
  JOIN subjects subject ON subject.id = e.subject_id
  JOIN students s ON s.id = e.student_id
  JOIN users student_user ON student_user.id = s.user_id
`;

export const listGrades = async () => {
  const { rows } = await query(`${gradeSelect} ORDER BY g.created_at DESC`);
  return rows;
};

export const listGradesByStudent = async (studentId) => {
  const { rows } = await query(
    `${gradeSelect} WHERE e.student_id = $1 ORDER BY g.created_at DESC`,
    [studentId]
  );
  return rows;
};

export const listGradesByTeacher = async (teacherId) => {
  const { rows } = await query(
    `${gradeSelect}
     JOIN subjects teacher_subject ON teacher_subject.id = e.subject_id
     WHERE teacher_subject.teacher_id = $1
     ORDER BY g.created_at DESC`,
    [teacherId]
  );
  return rows;
};

export const findGradeById = async (id) => {
  const { rows } = await query(`${gradeSelect} WHERE g.id = $1`, [id]);
  return rows[0] || null;
};

export const createGrade = async ({ enrollment_id, title, score, weight }) => {
  const { rows } = await query(
    `INSERT INTO grades (enrollment_id, title, score, weight)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [enrollment_id, title, score, weight]
  );

  return findGradeById(rows[0].id);
};

export const updateGrade = async (id, { enrollment_id, title, score, weight }) => {
  const { rows } = await query(
    `UPDATE grades
     SET enrollment_id = $1, title = $2, score = $3, weight = $4
     WHERE id = $5
     RETURNING id`,
    [enrollment_id, title, score, weight, id]
  );

  if (!rows[0]) {
    return null;
  }

  return findGradeById(id);
};

export const deleteGrade = async (id) => {
  await query("DELETE FROM grades WHERE id = $1", [id]);
};
