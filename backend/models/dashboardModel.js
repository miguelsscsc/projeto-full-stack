import { query } from "../config/database.js";

export const getSummary = async () => {
  const { rows } = await query(
    `SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM students) AS total_students,
      (SELECT COUNT(*)::int FROM classes) AS total_classes,
      (SELECT COUNT(*)::int FROM enrollments) AS total_enrollments,
      (SELECT COUNT(*)::int FROM grades) AS total_grades`
  );

  return rows[0];
};

export const getRecentEnrollments = async () => {
  const { rows } = await query(
    `SELECT
      e.id,
      student_user.name AS student_name,
      subject.name AS subject_name,
      e.attendance,
      e.status
     FROM enrollments e
     JOIN students student ON student.id = e.student_id
     JOIN users student_user ON student_user.id = student.user_id
     JOIN subjects subject ON subject.id = e.subject_id
     ORDER BY e.created_at DESC
     LIMIT 5`
  );

  return rows;
};

export const getRecentEnrollmentsByStudent = async (studentId) => {
  const { rows } = await query(
    `SELECT
      e.id,
      subject.name AS subject_name,
      e.attendance,
      e.status
     FROM enrollments e
     JOIN subjects subject ON subject.id = e.subject_id
     WHERE e.student_id = $1
     ORDER BY e.created_at DESC`,
    [studentId]
  );

  return rows;
};

export const getRecentEnrollmentsByTeacher = async (teacherId) => {
  const { rows } = await query(
    `SELECT
      e.id,
      student_user.name AS student_name,
      subject.name AS subject_name,
      e.attendance,
      e.status
     FROM enrollments e
     JOIN students student ON student.id = e.student_id
     JOIN users student_user ON student_user.id = student.user_id
     JOIN subjects subject ON subject.id = e.subject_id
     WHERE subject.teacher_id = $1
     ORDER BY e.created_at DESC`,
    [teacherId]
  );

  return rows;
};
