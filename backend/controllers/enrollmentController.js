import {
  createEnrollment,
  deleteEnrollment,
  findEnrollmentById,
  listEnrollments,
  listEnrollmentsByStudent,
  listEnrollmentsByTeacher,
  updateEnrollment,
} from "../models/enrollmentModel.js";
import { AppError } from "../utils/AppError.js";

export const getEnrollments = async (request, response) => {
  if (request.user.role === "teacher") {
    return response.json(await listEnrollmentsByTeacher(request.user.id));
  }

  if (request.user.role === "student") {
    return response.json(await listEnrollmentsByStudent(request.user.id));
  }

  return response.json(await listEnrollments());
};

export const createEnrollmentController = async (request, response) => {
  const enrollment = await createEnrollment(request.body);
  response.status(201).json(enrollment);
};

export const updateEnrollmentController = async (request, response) => {
  const existing = await findEnrollmentById(request.params.id);
  if (!existing) {
    throw new AppError("Matrícula não encontrada.", 404);
  }

  if (request.user.role === "teacher" && existing.teacher_id !== request.user.id) {
    throw new AppError("Você só pode editar matrículas das suas disciplinas.", 403);
  }

  const payload =
    request.user.role === "teacher"
      ? {
          student_id: existing.student_id,
          subject_id: existing.subject_id,
          status: request.body.status,
          grade: request.body.grade,
          attendance: request.body.attendance,
        }
      : request.body;

  const enrollment = await updateEnrollment(request.params.id, payload);
  response.json(enrollment);
};

export const deleteEnrollmentController = async (request, response) => {
  await deleteEnrollment(request.params.id);
  response.status(204).send();
};
