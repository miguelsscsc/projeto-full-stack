import {
  createSubject,
  deleteSubject,
  findSubjectById,
  listSubjects,
  listSubjectsByStudent,
  listSubjectsByTeacher,
  updateSubject,
} from "../models/subjectModel.js";
import { AppError } from "../utils/AppError.js";

export const getSubjects = async (request, response) => {
  if (request.user.role === "teacher") {
    return response.json(await listSubjectsByTeacher(request.user.id));
  }

  if (request.user.role === "student") {
    return response.json(await listSubjectsByStudent(request.user.id));
  }

  return response.json(await listSubjects());
};

export const createSubjectController = async (request, response) => {
  const subject = await createSubject(request.body);
  response.status(201).json(subject);
};

export const updateSubjectController = async (request, response) => {
  const existing = await findSubjectById(request.params.id);
  if (!existing) {
    throw new AppError("Disciplina não encontrada.", 404);
  }

  const subject = await updateSubject(request.params.id, request.body);
  response.json(subject);
};

export const deleteSubjectController = async (request, response) => {
  await deleteSubject(request.params.id);
  response.status(204).send();
};
