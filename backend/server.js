import app from "./app.js";
import { pool } from "./config/database.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    app.listen(env.port, () => {
      console.log(`API escolar rodando na porta ${env.port}`);
    });
  } catch (error) {
    console.error("Falha ao conectar no PostgreSQL:", error.message);
    process.exit(1);
  }
};

startServer();
