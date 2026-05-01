import app from "./app.js";
import { initializeDatabase } from "./config/initDatabase.js";
import { pool } from "./config/database.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    await initializeDatabase();

    app.listen(env.port, () => {
      console.log(`API escolar rodando na porta ${env.port}`);
    });
  } catch (error) {
    console.error(
      "Falha ao conectar/inicializar o PostgreSQL:",
      error.message || error.code || error.name
    );
    process.exit(1);
  }
};

startServer();
