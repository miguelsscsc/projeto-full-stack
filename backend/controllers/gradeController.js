import {
  createGrade,
  deleteGrade,
  findGradeById,
  listGrades,
  listGradesByStudent,
  listGradesByTeacher,
  updateGrade,
} from "../models/gradeModel.js";
import { findEnrollmentById } from "../models/enrollmentModel.js";
import { findStudentByUserId } from "../models/studentModel.js";
import { AppError } from "../utils/AppError.js";

export const getGrades = async (request, response) => {
  if (request.user.role === "teacher") {
    return response.json(await listGradesByTeacher(request.user.id));
  }

  if (request.user.role === "student") {
    const student = await findStudentByUserId(request.user.id);
    return response.json(student ? await listGradesByStudent(student.id) : []);
  }

  return response.json(await listGrades());
};

export const createGradeController = async (request, response) => {
  const enrollment = await findEnrollmentById(request.body.enrollment_id);
  if (!enrollment) {
    throw new AppError("Matrícula não encontrada.", 404);
  }

  if (request.user.role === "teacher" && enrollment.teacher_id !== request.user.id) {
    throw new AppError("Você só pode lançar notas das suas disciplinas.", 403);
  }

  const grade = await createGrade(request.body);
  response.status(201).json(grade);
};

export const updateGradeController = async (request, response) => {
  const existing = await findGradeById(request.params.id);
  if (!existing) {
    throw new AppError("Nota não encontrada.", 404);
  }

  const enrollment = await findEnrollmentById(request.body.enrollment_id);
  if (!enrollment) {
    throw new AppError("Matrícula não encontrada.", 404);
  }

  if (request.user.role === "teacher" && enrollment.teacher_id !== request.user.id) {
    throw new AppError("Você só pode editar notas das suas disciplinas.", 403);
  }

  const grade = await updateGrade(request.params.id, request.body);
  response.json(grade);
};

export const deleteGradeController = async (request, response) => {
  const existing = await findGradeById(request.params.id);
  if (!existing) {
    throw new AppError("Nota não encontrada.", 404);
  }

  const enrollment = await findEnrollmentById(existing.enrollment_id);
  if (request.user.role === "teacher" && enrollment?.teacher_id !== request.user.id) {
    throw new AppError("Você só pode excluir notas das suas disciplinas.", 403);
  }

  await deleteGrade(request.params.id);
  response.status(204).send();
};
