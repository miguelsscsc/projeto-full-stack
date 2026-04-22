export const authorizeRoles =
  (...roles) =>
  (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ message: "Acesso negado para este perfil." });
    }

    return next();
  };
