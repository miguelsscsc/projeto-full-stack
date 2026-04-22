import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { findUserById } from "../models/userModel.js";

export const authenticate = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ message: "Token não informado." });
    }

    const [, token] = authHeader.split(" ");
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await findUserById(payload.sub);

    if (!user) {
      return response.status(401).json({ message: "Usuário inválido." });
    }

    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ message: "Token inválido ou expirado." });
  }
};
