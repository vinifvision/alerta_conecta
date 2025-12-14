import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// Mantemos a URL real caso o login volte a funcionar, mas não será usada agora
const LOGIN_API_URL =
  "https://hastily-preaseptic-myrle.ngrok-free.dev/database/user/login";

export interface User {
  status: string;
  name: string;
  email: string;
  role: string;
  cpf: string;
}

// Usuário "Falso" para enganar o sistema e entrar direto
const MOCK_USER: User = {
  status: "sucesso",
  name: "Gerente (Gravação)",
  email: "gravacao@alertaconecta.com",
  role: "Gerente", // Importante ser um cargo que tenha permissão
  cpf: "111.111.111-11",
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (cpf: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // --- BYPASS DE LOGIN ATIVADO ---
    console.warn("⚠️ MODO GRAVAÇÃO: Login ignorado. Entrando direto...");

    // 1. Define o usuário fake
    setUser(MOCK_USER);

    // 2. Define um token fake para as requisições não quebrarem no front
    // (Se o backend exigir token real, as listas podem vir vazias,
    // mas você entrará na tela Home).
    if (!localStorage.getItem("authToken")) {
      localStorage.setItem("authToken", "token-de-gravacao-dummy");
    }

    // 3. Libera o carregamento
    setLoading(false);

    // Opcional: Se estiver na raiz, joga pra home
    if (window.location.pathname === "/") {
      navigate("/home");
    }
  }, []);

  const login = async (cpf: string, pass: string) => {
    // Login simulado que sempre dá certo
    setUser(MOCK_USER);
    navigate("/home");
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/");
    // Recarrega a página para o bypass funcionar de novo se necessário
    window.location.reload();
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-[#1650A7]">
        Preparando ambiente de gravação...
      </div>
    );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
