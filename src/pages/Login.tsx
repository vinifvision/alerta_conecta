import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [cpf, setCpf] = useState("");
  const [pass, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(cpf, pass);
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.message || "CPF ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-white">
      <div className="w-1/2 bg-[#1650A7]/90 flex items-center justify-center relative overflow-hidden max-md:hidden">
        <img
          src="AlertaConectaLogo (1).svg"
          alt="Alerta Conecta Logo"
          className="absolute inset-0 w-full h-full object-cover "
        />
      </div>

      <div className="w-1/2 flex items-center justify-center px-12 max-md:w-full">
        <div className="w-full max-w-sm">
          <h2 className="text-[#1650A7] text-2xl font-bold mb-2">
            Fazer login
          </h2>
          <p className="text-[#666] text-sm mb-8">Conecte-se com uma conta</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="CPF (apenas números)"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full h-12 px-4 bg-[#F6F6F6] border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1650A7]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                value={pass}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-[#F6F6F6] border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1650A7]"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-[#1650A7] text-white rounded-full font-medium hover:bg-[#0f3d7f] transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
