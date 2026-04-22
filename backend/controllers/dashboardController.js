import {
  getRecentEnrollments,
  getRecentEnrollmentsByStudent,
  getRecentEnrollmentsByTeacher,
  getSummary,
} from "../models/dashboardModel.js";

export const getDashboard = async (request, response) => {
  const summary = await getSummary();
  let recentEnrollments = await getRecentEnrollments();

  if (request.user.role === "teacher") {
    recentEnrollments = await getRecentEnrollmentsByTeacher(request.user.id);
  }

  if (request.user.role === "student") {
    recentEnrollments = await getRecentEnrollmentsByStudent(request.user.id);
  }

  response.json({ summary, recentEnrollments });
};
