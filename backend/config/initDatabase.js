import bcrypt from "bcrypt";
import { pool, query } from "./database.js";

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  school_year INTEGER NOT NULL,
  shift VARCHAR(30) NOT NULL,
  room VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  workload INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'locked')),
  grade NUMERIC(4,1) NOT NULL DEFAULT 0,
  attendance NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, subject_id)
);
`;

const seed = async () => {
  const { rows } = await query("SELECT COUNT(*)::int AS total FROM users");
  if (rows[0].total > 0) {
    return;
  }

  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    ["Administrador", "admin@school.com", hashedPassword, "admin"]
  );

  const teacher = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    ["Ana Professora", "teacher@school.com", hashedPassword, "teacher"]
  );

  const student = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    ["Carlos Aluno", "student@school.com", hashedPassword, "student"]
  );

  const classGroup = await query(
    `INSERT INTO classes (name, school_year, shift, room)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    ["Turma 1A", 2026, "Manhã", "Sala 12"]
  );

  const subject = await query(
    `INSERT INTO subjects (name, workload, teacher_id, class_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    ["Matemática", 80, teacher.rows[0].id, classGroup.rows[0].id]
  );

  await query(
    `INSERT INTO enrollments (student_id, subject_id, status, grade, attendance)
     VALUES ($1, $2, $3, $4, $5)`,
    [student.rows[0].id, subject.rows[0].id, "active", 8.5, 92]
  );

  void admin;
};

export const initializeDatabase = async () => {
  await query(schema);
  await seed();
};

initializeDatabase()
  .then(() => {
    console.log("Banco PostgreSQL inicializado com sucesso.");
  })
  .catch((error) => {
    console.error("Falha ao inicializar banco:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
