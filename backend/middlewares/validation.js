import { AppError } from "../utils/AppError.js";

const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === "";

export const validate =
  (rules) =>
  (request, _response, next) => {
    const errors = [];

    for (const rule of rules) {
      const value = request.body[rule.field];

      if (rule.required && isEmpty(value)) {
        errors.push(`O campo ${rule.field} é obrigatório.`);
        continue;
      }

      if (isEmpty(value)) {
        continue;
      }

      if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        errors.push(`O campo ${rule.field} deve ser um e-mail válido.`);
      }

      if (rule.type === "number" && Number.isNaN(Number(value))) {
        errors.push(`O campo ${rule.field} deve ser numérico.`);
      }

      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`O campo ${rule.field} possui um valor inválido.`);
      }

      if (rule.minLength && String(value).length < rule.minLength) {
        errors.push(`O campo ${rule.field} deve ter ao menos ${rule.minLength} caracteres.`);
      }
    }

    if (errors.length > 0) {
      return next(new AppError(errors[0], 422));
    }

    return next();
  };
