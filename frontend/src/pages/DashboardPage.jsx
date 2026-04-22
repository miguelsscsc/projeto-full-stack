import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { DataTable } from "../components/DataTable";
import { EntityForm } from "../components/EntityForm";
import { SectionCard } from "../components/SectionCard";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

const initialForms = {
  users: { name: "", email: "", password: "", role: "student" },
  classes: { name: "", school_year: "2026", shift: "", room: "" },
  subjects: { name: "", workload: "80", teacher_id: "", class_id: "" },
  enrollments: {
    student_id: "",
    subject_id: "",
    status: "active",
    grade: "0",
    attendance: "0",
  },
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState({ summary: {}, recentEnrollments: [] });
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [formValues, setFormValues] = useState(initialForms);
  const [editing, setEditing] = useState({});
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const isAdmin = user.role === "admin";
  const isTeacher = user.role === "teacher";

  const loadData = async () => {
    try {
      setError("");
      const [dashboardData, classesData, subjectsData, enrollmentsData, usersData] =
        await Promise.all([
          api.get("/dashboard"),
          api.get("/classes"),
          api.get("/subjects"),
          api.get("/enrollments"),
          isAdmin ? api.get("/users") : Promise.resolve([]),
        ]);

      setDashboard(dashboardData);
      setClasses(classesData);
      setSubjects(subjectsData);
      setEnrollments(enrollmentsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const teacherOptions = useMemo(
    () => users.filter((item) => item.role === "teacher").map((item) => ({
      value: String(item.id),
      label: item.name,
    })),
    [users]
  );

  const studentOptions = useMemo(
    () => users.filter((item) => item.role === "student").map((item) => ({
      value: String(item.id),
      label: item.name,
    })),
    [users]
  );

  const classOptions = useMemo(
    () =>
      classes.map((item) => ({
        value: String(item.id),
        label: `${item.name} - ${item.school_year}`,
      })),
    [classes]
  );

  const subjectOptions = useMemo(
    () =>
      subjects.map((item) => ({
        value: String(item.id),
        label: `${item.name} (${item.class_name})`,
      })),
    [subjects]
  );

  const handleFieldChange = (entity) => (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [entity]: { ...current[entity], [name]: value },
    }));
  };

  const resetEntity = (entity) => {
    setFormValues((current) => ({ ...current, [entity]: initialForms[entity] }));
    setEditing((current) => ({ ...current, [entity]: null }));
  };

  const handleSubmit = (entity, endpoint) => async (event) => {
    event.preventDefault();
    try {
      setError("");
      setInfo("");
      const payload = formValues[entity];
      const id = editing[entity]?.id;

      if (id) {
        await api.put(`/${endpoint}/${id}`, payload);
        setInfo("Registro atualizado com sucesso.");
      } else {
        await api.post(`/${endpoint}`, payload);
        setInfo("Registro criado com sucesso.");
      }

      resetEntity(entity);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (endpoint, id) => {
    try {
      setError("");
      setInfo("");
      await api.delete(`/${endpoint}/${id}`);
      setInfo("Registro removido com sucesso.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (entity, row, mapping = (value) => value) => {
    setEditing((current) => ({ ...current, [entity]: row }));
    setFormValues((current) => ({
      ...current,
      [entity]: mapping(row),
    }));
  };

  const summaryCards = [
    { label: "Usuários", value: dashboard.summary.total_users ?? 0 },
    { label: "Turmas", value: dashboard.summary.total_classes ?? 0 },
    { label: "Disciplinas", value: dashboard.summary.total_subjects ?? 0 },
    { label: "Matrículas", value: dashboard.summary.total_enrollments ?? 0 },
  ];

  return (
    <main className="dashboard-layout">
      <header className="topbar">
        <div>
          <p className="eyebrow">Painel escolar</p>
          <h1>{user.name}</h1>
          <span className="role-badge">{user.role}</span>
        </div>
        <button className="button button--ghost" onClick={logout}>
          Sair
        </button>
      </header>

      <section className="stats-grid">
        {summaryCards.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      {error ? <p className="feedback feedback--error">{error}</p> : null}
      {info ? <p className="feedback feedback--success">{info}</p> : null}

      <SectionCard
        title="Visão geral"
        subtitle="Resumo das movimentações recentes por perfil de acesso."
      >
        <DataTable
          columns={[
            {
              key: "student_name",
              label: "Aluno",
              render: (value) => value || user.name,
            },
            { key: "subject_name", label: "Disciplina" },
            { key: "grade", label: "Nota" },
            { key: "attendance", label: "Frequência" },
            { key: "status", label: "Status" },
          ]}
          rows={dashboard.recentEnrollments}
          emptyMessage="Nenhum dado encontrado."
        />
      </SectionCard>

      {isAdmin ? (
        <SectionCard title="Usuários" subtitle="Cadastre administradores, professores e alunos.">
          <EntityForm
            fields={[
              { name: "name", label: "Nome", required: true },
              { name: "email", label: "E-mail", type: "email", required: true },
              { name: "password", label: "Senha", type: "password", required: !editing.users },
              {
                name: "role",
                label: "Perfil",
                type: "select",
                required: true,
                options: [
                  { value: "admin", label: "Administrador" },
                  { value: "teacher", label: "Professor" },
                  { value: "student", label: "Aluno" },
                ],
              },
            ]}
            values={formValues.users}
            onChange={handleFieldChange("users")}
            onSubmit={handleSubmit("users", "users")}
            submitLabel={editing.users ? "Salvar usuário" : "Criar usuário"}
            onCancel={editing.users ? () => resetEntity("users") : undefined}
          />
          <DataTable
            columns={[
              { key: "name", label: "Nome" },
              { key: "email", label: "E-mail" },
              { key: "role", label: "Perfil" },
            ]}
            rows={users}
            emptyMessage="Nenhum usuário cadastrado."
            actions={(row) => (
              <div className="table-actions">
                <button
                  className="button button--small"
                  onClick={() => startEdit("users", row, (item) => ({ ...item, password: "" }))}
                >
                  Editar
                </button>
                <button
                  className="button button--small button--danger"
                  onClick={() => handleDelete("users", row.id)}
                >
                  Excluir
                </button>
              </div>
            )}
          />
        </SectionCard>
      ) : null}

      {isAdmin ? (
        <SectionCard title="Turmas" subtitle="Organize as turmas e sua estrutura anual.">
          <EntityForm
            fields={[
              { name: "name", label: "Nome", required: true },
              { name: "school_year", label: "Ano letivo", type: "number", required: true },
              { name: "shift", label: "Turno", required: true },
              { name: "room", label: "Sala", required: true },
            ]}
            values={formValues.classes}
            onChange={handleFieldChange("classes")}
            onSubmit={handleSubmit("classes", "classes")}
            submitLabel={editing.classes ? "Salvar turma" : "Criar turma"}
            onCancel={editing.classes ? () => resetEntity("classes") : undefined}
          />
          <DataTable
            columns={[
              { key: "name", label: "Turma" },
              { key: "school_year", label: "Ano" },
              { key: "shift", label: "Turno" },
              { key: "room", label: "Sala" },
              { key: "subjects_count", label: "Disciplinas" },
            ]}
            rows={classes}
            emptyMessage="Nenhuma turma cadastrada."
            actions={(row) => (
              <div className="table-actions">
                <button className="button button--small" onClick={() => startEdit("classes", row)}>
                  Editar
                </button>
                <button
                  className="button button--small button--danger"
                  onClick={() => handleDelete("classes", row.id)}
                >
                  Excluir
                </button>
              </div>
            )}
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Disciplinas"
        subtitle="Disciplinas relacionadas a professores e turmas."
      >
        {isAdmin ? (
          <EntityForm
            fields={[
              { name: "name", label: "Nome", required: true },
              { name: "workload", label: "Carga horária", type: "number", required: true },
              {
                name: "teacher_id",
                label: "Professor",
                type: "select",
                required: true,
                options: teacherOptions,
              },
              {
                name: "class_id",
                label: "Turma",
                type: "select",
                required: true,
                options: classOptions,
              },
            ]}
            values={formValues.subjects}
            onChange={handleFieldChange("subjects")}
            onSubmit={handleSubmit("subjects", "subjects")}
            submitLabel={editing.subjects ? "Salvar disciplina" : "Criar disciplina"}
            onCancel={editing.subjects ? () => resetEntity("subjects") : undefined}
          />
        ) : null}
        <DataTable
          columns={[
            { key: "name", label: "Disciplina" },
            { key: "teacher_name", label: "Professor" },
            { key: "class_name", label: "Turma" },
            { key: "workload", label: "Carga horária" },
          ]}
          rows={subjects}
          emptyMessage="Nenhuma disciplina encontrada."
          actions={
            isAdmin
              ? (row) => (
                  <div className="table-actions">
                    <button
                      className="button button--small"
                      onClick={() =>
                        startEdit("subjects", row, (item) => ({
                          name: item.name,
                          workload: String(item.workload),
                          teacher_id: String(item.teacher_id),
                          class_id: String(item.class_id),
                        }))
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="button button--small button--danger"
                      onClick={() => handleDelete("subjects", row.id)}
                    >
                      Excluir
                    </button>
                  </div>
                )
              : undefined
          }
        />
      </SectionCard>

      <SectionCard
        title="Matrículas"
        subtitle={
          isTeacher
            ? "Como professor, você pode atualizar nota, frequência e status."
            : "Relacionamento entre aluno e disciplina com status acadêmico."
        }
      >
        {isAdmin || editing.enrollments ? (
          <EntityForm
            fields={[
              ...(isAdmin
                ? [
                    {
                      name: "student_id",
                      label: "Aluno",
                      type: "select",
                      required: true,
                      options: studentOptions,
                    },
                    {
                      name: "subject_id",
                      label: "Disciplina",
                      type: "select",
                      required: true,
                      options: subjectOptions,
                    },
                  ]
                : []),
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { value: "active", label: "Ativa" },
                  { value: "completed", label: "Concluída" },
                  { value: "locked", label: "Bloqueada" },
                ],
              },
              { name: "grade", label: "Nota", type: "number", required: true, step: "0.1" },
              {
                name: "attendance",
                label: "Frequência",
                type: "number",
                required: true,
                step: "0.1",
              },
            ]}
            values={formValues.enrollments}
            onChange={handleFieldChange("enrollments")}
            onSubmit={handleSubmit("enrollments", "enrollments")}
            submitLabel={
              editing.enrollments
                ? "Salvar matrícula"
                : "Criar matrícula"
            }
            onCancel={editing.enrollments ? () => resetEntity("enrollments") : undefined}
          />
        ) : null}
        <DataTable
          columns={[
            { key: "student_name", label: "Aluno" },
            { key: "subject_name", label: "Disciplina" },
            { key: "class_name", label: "Turma" },
            { key: "grade", label: "Nota" },
            { key: "attendance", label: "Frequência" },
            { key: "status", label: "Status" },
          ]}
          rows={enrollments}
          emptyMessage="Nenhuma matrícula encontrada."
          actions={
            isAdmin || isTeacher
              ? (row) => (
                  <div className="table-actions">
                    <button
                      className="button button--small"
                      onClick={() =>
                        startEdit("enrollments", row, (item) => ({
                          student_id: String(item.student_id),
                          subject_id: String(item.subject_id),
                          status: item.status,
                          grade: String(item.grade),
                          attendance: String(item.attendance),
                        }))
                      }
                    >
                      Editar
                    </button>
                    {isAdmin ? (
                      <button
                        className="button button--small button--danger"
                        onClick={() => handleDelete("enrollments", row.id)}
                      >
                        Excluir
                      </button>
                    ) : null}
                  </div>
                )
              : undefined
          }
        />
      </SectionCard>
    </main>
  );
};
