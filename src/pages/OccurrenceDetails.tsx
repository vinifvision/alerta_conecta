import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

// Tipo dos dados
type OccurrenceDetail = {
  id: number;
  data: string;
  hora: number;
  tipo_ocorrencia: string;
  regiao: string;
  prioridade: string;
  status: string;
  num_vitimas: number;
  idade_vitima: number;
  tempo_resposta_min: number;
};

const OccurrenceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<OccurrenceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Buscar dados da ocorrência
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/occurrences/${id}`
        );
        if (!response.ok) throw new Error("Ocorrência não encontrada");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar detalhes.");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  // Atualizar Status (Concluir/Cancelar)
  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/occurrences/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar");

      toast.success(`Status alterado para: ${newStatus}`);

      // Atualiza o estado local para refletir na tela imediatamente
      setData((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    } finally {
      setUpdating(false);
    }
  };

  // Cores dinâmicas
  const getPriorityColor = (p: string) => {
    if (p === "Alta") return "text-red-600 bg-red-50 border-red-200";
    if (p === "Média") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando detalhes...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F9F9] overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header de Navegação */}
        <div className="mb-8">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1650A7] mb-4 transition"
          >
            <ArrowLeft size={18} /> Voltar para lista
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-blue-100 text-[#1650A7] px-3 py-1 rounded-full text-xs font-bold font-mono">
                  #{data.id}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    data.status === "Concluído"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : data.status === "Cancelado"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }`}
                >
                  {data.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {data.tipo_ocorrencia}
              </h1>
            </div>

            {/* Botões de Ação */}
            {data.status === "Em Andamento" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdateStatus("Cancelado")}
                  disabled={updating}
                  className="px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 flex items-center gap-2 font-medium disabled:opacity-50"
                >
                  <XCircle size={18} /> Cancelar
                </button>
                <button
                  onClick={() => handleUpdateStatus("Concluído")}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm disabled:opacity-50"
                >
                  <CheckCircle size={18} /> Finalizar Atendimento
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-[#1650A7] mb-6 flex items-center gap-2">
                <FileText size={20} /> Informações Operacionais
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <DetailItem
                  icon={<AlertTriangle size={18} />}
                  label="Prioridade"
                  value={
                    <span
                      className={`px-2 py-0.5 rounded text-sm font-semibold border ${getPriorityColor(
                        data.prioridade
                      )}`}
                    >
                      {data.prioridade}
                    </span>
                  }
                />
                <DetailItem
                  icon={<MapPin size={18} />}
                  label="Região / Local"
                  value={data.regiao}
                />
                <DetailItem
                  icon={<Calendar size={18} />}
                  label="Data do Registro"
                  value={new Date(data.data).toLocaleDateString("pt-BR")}
                />
                <DetailItem
                  icon={<Clock size={18} />}
                  label="Hora da Chamada"
                  value={`${data.hora}:00 h`}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Descrição / Protocolo
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ocorrência do tipo <strong>{data.tipo_ocorrencia}</strong>{" "}
                  registrada na região <strong>{data.regiao}</strong>. A
                  prioridade foi definida automaticamente pela IA como{" "}
                  <strong>{data.prioridade}</strong> com base nos fatores de
                  risco e histórico da região.
                </p>
              </div>
            </div>

            {/* Card de Vítimas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-[#1650A7] mb-6 flex items-center gap-2">
                <Users size={20} /> Vítimas Envolvidas
              </h2>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total de Vítimas</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.num_vitimas}
                  </p>
                </div>
                {data.num_vitimas > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Idade Média Estimada
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {data.idade_vitima}{" "}
                      <span className="text-sm font-normal text-gray-400">
                        anos
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Lateral - Status e Métricas */}
          <div className="space-y-6">
            {/* Card de Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">
                Status Atual
              </h2>
              <div className="flex flex-col gap-4">
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    data.status === "Em Andamento"
                      ? "bg-blue-50 border border-blue-100"
                      : "bg-gray-50"
                  }`}
                >
                  <Activity
                    className={`mt-0.5 ${
                      data.status === "Em Andamento"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                    size={18}
                  />
                  <div>
                    <p className="font-bold text-gray-900">Em Atendimento</p>
                    <p className="text-xs text-gray-500">
                      Equipe deslocada ou em operação.
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    data.status === "Concluído"
                      ? "bg-green-50 border border-green-100"
                      : "bg-gray-50"
                  }`}
                >
                  <CheckCircle
                    className={`mt-0.5 ${
                      data.status === "Concluído"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                    size={18}
                  />
                  <div>
                    <p className="font-bold text-gray-900">Concluído</p>
                    <p className="text-xs text-gray-500">
                      Ocorrência finalizada com sucesso.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Tempo de Resposta */}
            <div className="bg-[#1650A7] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-200 text-sm mb-1">Tempo de Resposta</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {data.tempo_resposta_min}
                  </span>
                  <span className="text-lg opacity-80">min</span>
                </div>
                <p className="text-xs text-blue-200 mt-2">
                  Desde o acionamento até a chegada.
                </p>
              </div>
              {/* Elemento decorativo */}
              <Clock className="absolute -right-4 -bottom-4 text-blue-500 opacity-20 w-32 h-32" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente auxiliar para exibir linha de detalhe
const DetailItem = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-gray-400">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 mb-0.5">{label}</p>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  </div>
);

export default OccurrenceDetails;
