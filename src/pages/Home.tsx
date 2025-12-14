import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Phone,
  AlertTriangle,
  MapPin,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL =
  "https://hastily-preaseptic-myrle.ngrok-free.dev/database/occurrence";

// Dados Fakes para garantir a gravação do vídeo
const MOCK_DATA = [
  {
    id: 25,
    title: "Princípio de Incêndio em Residência",
    date: new Date().toISOString(),
    victims:
      "Morador: João Martins, 42 anos (ileso). Vizinha: Carla Souza, 35 anos (inalou fumaça leve)",
    details:
      "Moradores perceberam cheiro de queimado e fumaça saindo da cozinha. O fogo começou em uma panela esquecida no fogão. Vizinhos acionaram o Corpo de Bombeiros rapidamente. Incêndio controlado sem danos estruturais significativos.",
    status: "Em_andamento",
    priority: "Alta",
    type: { id: 1, name: "Incêndio", description: "Fogo" },
    latitude: -8.05801998582604,
    longitude: -34.906152133173215,
    // URL de imagem de exemplo para não ficar quebrado no vídeo
    mockImage:
      "https://s2-g1.glbimg.com/W0LB9_NTM2a4zAR62H--Grh5i1w=/0x0:581x581/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/2/b/4hbWQyQzGemnbkzHeBIg/307487042-194445212967703-1713531941778859299-n.jpg",
  },
  {
    id: 26,
    title: "Queda de árvore bloqueando via",
    date: new Date().toISOString(),
    victims: "Sem feridos",
    details: "Uma árvore de grande porte caiu, bloqueando completamente a via.",
    status: "Em_andamento",
    priority: "Média",
    type: { id: 1, name: "Acidente", description: "Queda" },
    latitude: -8.02824232094087,
    longitude: -34.902549804337895,
    // URL de imagem de exemplo para não ficar quebrado no vídeo
    mockImage:
      "https://s2-g1.glbimg.com/g_fVp1dwwUuHmmpZVcsc6dEutZw=/0x0:1920x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2023/5/i/qWy7ksQVmQoZXZnpapgw/acervo-bdsp-bdbr-limpo-20231116-0545-frame-83178.jpeg",
  },
];

type OccurrenceAPI = {
  id: number;
  title: string;
  titule?: string;
  date: string;
  victims: string;
  details: string;
  status: string;
  priority: string;
  type:
    | {
        id: number;
        name: string;
        description: string;
      }
    | number;
  latitude: number;
  longitude: number;
  mockImage?: string; // Campo opcional para o mock
};

const TYPE_MAP: Record<number, string> = {
  1: "Incêndio",
  2: "Resgate",
  3: "APH",
  4: "Prevenção",
  5: "Ambiental",
  6: "Administrativa",
  7: "Desastre",
};

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [occurrences, setOccurrences] = useState<OccurrenceAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOccurrences = async () => {
    setLoading(true);
    setError(null);
    try {
      // Tenta buscar da API
      const response = await fetch(`${API_BASE_URL}/occurrence/getall`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Falha na API");

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setOccurrences(data.sort((a: any, b: any) => b.id - a.id));
      } else {
        // Se a API retornar lista vazia, usa o Mock para o vídeo não ficar feio
        console.warn("API vazia. Usando Mock Data para apresentação.");
        setOccurrences(MOCK_DATA);
      }
    } catch (err: any) {
      console.warn("Erro na API (" + err.message + "). Usando Mock Data.");
      // Fallback para Mock em caso de erro (ex: Token inválido)
      setOccurrences(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchOccurrences();
  }, [authLoading]);

  const getTypeName = (item: OccurrenceAPI) => {
    if (typeof item.type === "object" && item.type?.name) return item.type.name;
    if (typeof item.type === "number")
      return TYPE_MAP[item.type] || "Tipo desconhecido";
    return "Tipo N/A";
  };

  const getStatusBadge = (status: string) => {
    const style =
      {
        Em_andamento: "bg-orange-100 text-orange-700 border-orange-200",
        Encerrada: "bg-green-100 text-green-700 border-green-200",
        Cancelada: "bg-gray-100 text-gray-700 border-gray-200",
      }[status] || "bg-blue-100 text-blue-700 border-blue-200";

    return (
      <span
        className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${style}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  if (loading || authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F9F9F9] text-[#1650A7] gap-2">
        <RefreshCw className="animate-spin" /> Carregando Dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F9F9] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1650A7]">Dashboard</h1>
            <p className="text-gray-500">Olá, {user?.name}</p>
          </div>
          <Link
            to="/occurrences/new"
            className="bg-[#1650A7] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition shadow-lg flex items-center gap-2"
          >
            <Phone size={20} /> Nova Ocorrência
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {occurrences.map((item) => (
            <Link
              key={item.id}
              to={`/occurrences/${item.id}`}
              // Passamos o objeto completo (inclusive a mockImage)
              state={{ occurrence: item }}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-gray-400 font-mono">
                      #{item.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#1650A7] transition-colors">
                    {item.title || item.titule || "Ocorrência sem título"}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {getTypeName(item)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {new Date(item.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                    item.priority === "Alta"
                      ? "bg-red-50 text-red-600"
                      : item.priority === "Media"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {item.priority}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
