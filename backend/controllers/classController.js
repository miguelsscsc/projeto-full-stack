import {
  createClass,
  deleteClass,
  findClassById,
  listClasses,
  updateClass,
} from "../models/classModel.js";
import { AppError } from "../utils/AppError.js";

export const getClasses = async (_request, response) => {
  const classes = await listClasses();
  response.json(classes);
};

export const createClassController = async (request, response) => {
  const classGroup = await createClass(request.body);
  response.status(201).json(classGroup);
};

export const updateClassController = async (request, response) => {
  const existing = await findClassById(request.params.id);
  if (!existing) {
    throw new AppError("Turma não encontrada.", 404);
  }

  const classGroup = await updateClass(request.params.id, request.body);
  response.json(classGroup);
};

export const deleteClassController = async (request, response) => {
  await deleteClass(request.params.id);
  response.status(204).send();
};
