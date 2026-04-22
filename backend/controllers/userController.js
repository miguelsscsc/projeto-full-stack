import bcrypt from "bcrypt";
import {
  createUser,
  deleteUser,
  findUserAuthByEmail,
  findUserById,
  listUsers,
  updateUser,
} from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";

export const getUsers = async (_request, response) => {
  const users = await listUsers();
  response.json(users);
};

export const createUserController = async (request, response) => {
  const { name, email, password, role } = request.body;
  const existing = await findUserAuthByEmail(email);

  if (existing) {
    throw new AppError("Este e-mail já está cadastrado.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashedPassword, role });

  response.status(201).json(user);
};

export const updateUserController = async (request, response) => {
  const { id } = request.params;
  const currentUser = await findUserAuthByEmail(request.body.email);
  const existing = await findUserById(id);

  if (!existing) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  if (currentUser && currentUser.id !== Number(id)) {
    throw new AppError("Este e-mail já está cadastrado.");
  }

  const password = request.body.password
    ? await bcrypt.hash(request.body.password, 10)
    : (await findUserAuthByEmail(existing.email))?.password;

  const user = await updateUser(id, {
    name: request.body.name,
    email: request.body.email,
    password,
    role: request.body.role,
  });

  response.json(user);
};

export const deleteUserController = async (request, response) => {
  await deleteUser(request.params.id);
  response.status(204).send();
};
