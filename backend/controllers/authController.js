import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { createUser, findUserAuthByEmail } from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";

export const login = async (request, response) => {
  const { email, password } = request.body;
  const user = await findUserAuthByEmail(email);

  if (!user) {
    throw new AppError("Credenciais inválidas.", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError("Credenciais inválidas.", 401);
  }

  const token = jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: "8h",
  });

  response.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const registerStudent = async (request, response) => {
  const { name, email, password } = request.body;
  const existingUser = await findUserAuthByEmail(email);

  if (existingUser) {
    throw new AppError("Este e-mail já está em uso.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role: "student",
  });

  response.status(201).json(user);
};

export const me = async (request, response) => {
  response.json(request.user);
};
