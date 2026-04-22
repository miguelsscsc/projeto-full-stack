export const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Erro interno do servidor.";

  response.status(statusCode).json({ message });
};
