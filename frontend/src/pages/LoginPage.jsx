import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const initialRegister = { name: "", email: "", password: "" };

export const LoginPage = () => {
  const { login, register } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState(initialRegister);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(credentials);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await register(registerData);
      setMessage("Cadastro realizado com sucesso. Agora você já pode entrar.");
      setRegisterData(initialRegister);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-layout">
      <section className="hero-panel">
        <p className="eyebrow">Sistema Escolar Fullstack</p>
        <h1>Gestão acadêmica com front-end React, API Node e banco SQL.</h1>
        <p>
          Controle usuários por perfil, turmas, disciplinas, matrículas, notas e
          frequência em uma aplicação integrada de ponta a ponta.
        </p>
        <ul className="hero-list">
          <li>JWT para autenticação segura</li>
          <li>Roles para admin, professor e aluno</li>
          <li>CRUD completo com relacionamento SQL</li>
        </ul>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Acessar</h2>
          <p>Use as contas seed ou crie um novo aluno.</p>
          <form onSubmit={handleLogin} className="stack-form">
            <input
              type="email"
              placeholder="E-mail"
              value={credentials.email}
              onChange={(event) =>
                setCredentials((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((current) => ({ ...current, password: event.target.value }))
              }
              required
            />
            <button type="submit" className="button button--primary" disabled={loading}>
              Entrar
            </button>
          </form>

          <div className="seed-box">
            <strong>Contas iniciais</strong>
            <span>`admin@school.com` / `123456`</span>
            <span>`teacher@school.com` / `123456`</span>
            <span>`student@school.com` / `123456`</span>
          </div>

          <hr />

          <h2>Criar conta de aluno</h2>
          <form onSubmit={handleRegister} className="stack-form">
            <input
              type="text"
              placeholder="Nome completo"
              value={registerData.name}
              onChange={(event) =>
                setRegisterData((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={registerData.email}
              onChange={(event) =>
                setRegisterData((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={registerData.password}
              onChange={(event) =>
                setRegisterData((current) => ({ ...current, password: event.target.value }))
              }
              required
            />
            <button type="submit" className="button button--secondary" disabled={loading}>
              Cadastrar
            </button>
          </form>

          {error ? <p className="feedback feedback--error">{error}</p> : null}
          {message ? <p className="feedback feedback--success">{message}</p> : null}
        </div>
      </section>
    </main>
  );
};
