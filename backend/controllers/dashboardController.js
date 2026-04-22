import {
  getRecentEnrollments,
  getRecentEnrollmentsByStudent,
  getRecentEnrollmentsByTeacher,
  getSummary,
} from "../models/dashboardModel.js";
import { findStudentByUserId } from "../models/studentModel.js";

export const getDashboard = async (request, response) => {
  const summary = await getSummary();
  let recentEnrollments = await getRecentEnrollments();

  if (request.user.role === "teacher") {
    recentEnrollments = await getRecentEnrollmentsByTeacher(request.user.id);
  }

  if (request.user.role === "student") {
    const student = await findStudentByUserId(request.user.id);
    recentEnrollments = student ? await getRecentEnrollmentsByStudent(student.id) : [];
  }

  response.json({ summary, recentEnrollments });
};
