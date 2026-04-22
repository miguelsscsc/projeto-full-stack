import { query } from "../config/database.js";

const enrollmentSelect = `
  SELECT
    e.id,
    e.student_id,
    e.subject_id,
    e.status,
    e.attendance,
    e.created_at,
    student_user.name AS student_name,
    student_user.email AS student_email,
    student.registration_number,
    subject.name AS subject_name,
    class_group.name AS class_name,
    teacher.name AS teacher_name,
    subject.teacher_id
  FROM enrollments e
  JOIN students student ON student.id = e.student_id
  JOIN users student_user ON student_user.id = student.user_id
  JOIN subjects subject ON subject.id = e.subject_id
  JOIN classes class_group ON class_group.id = subject.class_id
  JOIN users teacher ON teacher.id = subject.teacher_id
`;

export const listEnrollments = async () => {
  const { rows } = await query(`${enrollmentSelect} ORDER BY e.created_at DESC`);
  return rows;
};

export const listEnrollmentsByStudent = async (studentId) => {
  const { rows } = await query(
    `${enrollmentSelect} WHERE e.student_id = $1 ORDER BY e.created_at DESC`,
    [studentId]
  );
  return rows;
};

export const listEnrollmentsByTeacher = async (teacherId) => {
  const { rows } = await query(
    `${enrollmentSelect} WHERE subject.teacher_id = $1 ORDER BY e.created_at DESC`,
    [teacherId]
  );
  return rows;
};

export const findEnrollmentById = async (id) => {
  const { rows } = await query(`${enrollmentSelect} WHERE e.id = $1`, [id]);
  return rows[0] || null;
};

export const createEnrollment = async ({
  student_id,
  subject_id,
  status,
  attendance,
}) => {
  const { rows } = await query(
    `INSERT INTO enrollments (student_id, subject_id, status, attendance)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [student_id, subject_id, status, attendance]
  );
  return findEnrollmentById(rows[0].id);
};

export const updateEnrollment = async (
  id,
  { student_id, subject_id, status, attendance }
) => {
  const { rows } = await query(
    `UPDATE enrollments
     SET student_id = $1, subject_id = $2, status = $3, attendance = $4
     WHERE id = $5
     RETURNING id`,
    [student_id, subject_id, status, attendance, id]
  );

  if (!rows[0]) {
    return null;
  }

  return findEnrollmentById(id);
};

export const deleteEnrollment = async (id) => {
  await query("DELETE FROM enrollments WHERE id = $1", [id]);
};
