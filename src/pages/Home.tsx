import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  X,
} from "lucide-react";

// Tipo dos dados que vêm do Python
type Occurrence = {
  id: number;
  data: string;
  tipo_ocorrencia: string;
  regiao: string;
  prioridade: string;
  status: string;
};

const Home = () => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todas");

  useEffect(() => {
    fetchOccurrences();
  }, []);

  const fetchOccurrences = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/occurrences");
      const data = await response.json();
      setOccurrences(data);
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Filtragem Avançada
  const filteredData = occurrences.filter((occ) => {
    // 1. Filtro de Texto (Busca)
    const matchesSearch =
      occ.tipo_ocorrencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.regiao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.id.toString().includes(searchTerm);

    // 2. Filtro de Status
    const matchesStatus =
      statusFilter === "Todos" || occ.status === statusFilter;

    // 3. Filtro de Prioridade
    const matchesPriority =
      priorityFilter === "Todas" || occ.prioridade === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("Todos");
    setPriorityFilter("Todas");
  };

  // Helpers visuais
  const getPriorityColor = (p: string) => {
    if (p === "Alta") return "bg-red-100 text-red-700 border-red-200";
    if (p === "Média") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStatusIcon = (s: string) => {
    if (s === "Concluído")
      return <CheckCircle size={14} className="text-green-600" />;
    if (s === "Cancelado")
      return <XCircle size={14} className="text-red-600" />;
    return <Clock size={14} className="text-blue-600" />;
  };

  return (
    <div className="flex h-screen bg-[#F9F9F9] overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1650A7]">
              Ocorrências Recentes
            </h1>
            <p className="text-gray-500 text-sm">
              Monitoramento em tempo real do banco de dados.
            </p>
          </div>

          <Link
            to="/occurrences/new"
            className="flex items-center gap-2 bg-[#1650A7] text-white px-5 py-3 rounded-full font-semibold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
          >
            <PlusCircle size={20} />
            Nova Ocorrência
          </Link>
        </div>

        {/* Barra de Controles (Pesquisa + Botão Filtro) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por tipo, região ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1650A7]/20"
              />
            </div>

            {/* Botão que ativa/desativa painel de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
                showFilters
                  ? "bg-blue-50 border-blue-200 text-[#1650A7]"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filtros</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Painel Expansível de Filtros */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-end animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-40 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1650A7]/20"
                >
                  <option value="Todos">Todos</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Prioridade
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="block w-40 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1650A7]/20"
                >
                  <option value="Todas">Todas</option>
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
              >
                <X size={14} /> Limpar
              </button>
            </div>
          )}
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#1650A7] border-t-transparent rounded-full animate-spin" />
              Carregando dados...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Nenhuma ocorrência encontrada com os filtros atuais.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Tipo</th>
                    <th className="p-4 font-semibold">Região</th>
                    <th className="p-4 font-semibold">Data</th>
                    <th className="p-4 font-semibold text-center">
                      Prioridade
                    </th>
                    <th className="p-4 font-semibold text-center">Status</th>
                    <th className="p-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((occ) => (
                    <tr
                      key={occ.id}
                      className="hover:bg-blue-50/50 transition group"
                    >
                      <td className="p-4 font-mono text-xs text-gray-500">
                        #{occ.id}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {occ.tipo_ocorrencia}
                      </td>
                      <td className="p-4 text-gray-600">{occ.regiao}</td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(occ.data).toLocaleDateString("pt-BR")}
                        <span className="text-xs ml-1 opacity-60">
                          {new Date(occ.data).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                            occ.prioridade
                          )}`}
                        >
                          {occ.prioridade}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600">
                          {getStatusIcon(occ.status)}
                          {occ.status}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {/* CORREÇÃO AQUI: Botão agora é um Link real */}
                        <Link
                          to={`/occurrences/${occ.id}`}
                          className="text-[#1650A7] font-medium text-sm hover:underline opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
