import { query } from "../config/database.js";

const subjectSelect = `
  SELECT
    s.id,
    s.name,
    s.workload,
    s.teacher_id,
    s.class_id,
    s.created_at,
    u.name AS teacher_name,
    c.name AS class_name,
    c.school_year
  FROM subjects s
  JOIN users u ON u.id = s.teacher_id
  JOIN classes c ON c.id = s.class_id
`;

export const listSubjects = async () => {
  const { rows } = await query(`${subjectSelect} ORDER BY s.created_at DESC`);
  return rows;
};

export const listSubjectsByTeacher = async (teacherId) => {
  const { rows } = await query(
    `${subjectSelect} WHERE s.teacher_id = $1 ORDER BY s.created_at DESC`,
    [teacherId]
  );
  return rows;
};

export const listSubjectsByStudent = async (studentId) => {
  const { rows } = await query(
    `${subjectSelect}
     JOIN enrollments e ON e.subject_id = s.id
     WHERE e.student_id = $1
     ORDER BY s.created_at DESC`,
    [studentId]
  );
  return rows;
};

export const findSubjectById = async (id) => {
  const { rows } = await query(`${subjectSelect} WHERE s.id = $1`, [id]);
  return rows[0] || null;
};

export const createSubject = async ({ name, workload, teacher_id, class_id }) => {
  const { rows } = await query(
    `INSERT INTO subjects (name, workload, teacher_id, class_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [name, workload, teacher_id, class_id]
  );
  return findSubjectById(rows[0].id);
};

export const updateSubject = async (id, { name, workload, teacher_id, class_id }) => {
  const { rows } = await query(
    `UPDATE subjects
     SET name = $1, workload = $2, teacher_id = $3, class_id = $4
     WHERE id = $5
     RETURNING id`,
    [name, workload, teacher_id, class_id, id]
  );

  if (!rows[0]) {
    return null;
  }

  return findSubjectById(id);
};

export const deleteSubject = async (id) => {
  await query("DELETE FROM subjects WHERE id = $1", [id]);
};
