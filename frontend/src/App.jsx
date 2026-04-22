import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="loading-screen">Carregando sistema...</main>;
  }

  return user ? <DashboardPage /> : <LoginPage />;
};

export default App;
