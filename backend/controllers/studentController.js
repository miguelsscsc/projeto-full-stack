import { findClassById } from "../models/classModel.js";
import {
  createStudent,
  deleteStudent,
  findStudentById,
  findStudentByRegistration,
  findStudentByUserId,
  listStudents,
  updateStudent,
} from "../models/studentModel.js";
import { findUserById } from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";

export const getStudents = async (_request, response) => {
  const students = await listStudents();
  response.json(students);
};

export const createStudentController = async (request, response) => {
  const { user_id, class_id, registration_number } = request.body;
  const user = await findUserById(user_id);

  if (!user || user.role !== "student") {
    throw new AppError("O user_id informado deve pertencer a um usuário aluno.", 422);
  }

  const existingStudent = await findStudentByUserId(user_id);
  if (existingStudent) {
    throw new AppError("Este usuário já possui cadastro de aluno.");
  }

  const existingRegistration = await findStudentByRegistration(registration_number);
  if (existingRegistration) {
    throw new AppError("Número de matrícula já cadastrado.");
  }

  if (class_id) {
    const classGroup = await findClassById(class_id);
    if (!classGroup) {
      throw new AppError("Turma não encontrada.", 404);
    }
  }

  const student = await createStudent(request.body);
  response.status(201).json(student);
};

export const updateStudentController = async (request, response) => {
  const existing = await findStudentById(request.params.id);
  if (!existing) {
    throw new AppError("Aluno não encontrado.", 404);
  }

  const user = await findUserById(request.body.user_id);
  if (!user || user.role !== "student") {
    throw new AppError("O user_id informado deve pertencer a um usuário aluno.", 422);
  }

  const linkedStudent = await findStudentByUserId(request.body.user_id);
  if (linkedStudent && linkedStudent.id !== Number(request.params.id)) {
    throw new AppError("Este usuário já está vinculado a outro aluno.");
  }

  const registration = await findStudentByRegistration(request.body.registration_number);
  if (registration && registration.id !== Number(request.params.id)) {
    throw new AppError("Número de matrícula já cadastrado.");
  }

  if (request.body.class_id) {
    const classGroup = await findClassById(request.body.class_id);
    if (!classGroup) {
      throw new AppError("Turma não encontrada.", 404);
    }
  }

  const student = await updateStudent(request.params.id, request.body);
  response.json(student);
};

export const deleteStudentController = async (request, response) => {
  await deleteStudent(request.params.id);
  response.status(204).send();
};
