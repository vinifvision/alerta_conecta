import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  ArrowLeft,
  RefreshCw,
  BarChart3,
  PieChart as PieIcon,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { useNavigate } from "react-router-dom";

// Cores para os gráficos (Gradiente Azul/Alerta)
const COLORS = [
  "#1650A7",
  "#FF4444",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
];

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/dashboard");
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando Dashboard Inteligente...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F9F9] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <ArrowLeft className="text-[#1650A7]" />
            </button>
            <h1 className="text-2xl font-bold text-[#1650A7]">
              Dashboard Analítico & Preditivo
            </h1>
          </div>
          <button onClick={fetchDashboardData}>
            <RefreshCw className="text-[#1650A7]" />
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiCard label="Total" value={data.kpis.total} />
          <KpiCard
            label="Ativas"
            value={data.kpis.ativas}
            color="text-red-600"
          />
          <KpiCard
            label="Concluídas"
            value={data.kpis.concluidas}
            color="text-green-600"
          />
          <KpiCard label="Eficiência" value={data.kpis.eficiencia} />
        </div>

        {/* --- LINHA 1: Temporal e Frequência --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Linha (Temporal) */}
          <ChartCard title="Evolução Temporal (Último Ano)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ocorrencias"
                  stroke="#1650A7"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gráfico de Rosca (Frequência Relativa) */}
          <ChartCard title="Frequência por Tipo de Caso">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {data.pieData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* --- LINHA 2: Espacial e Histograma --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribuição Espacial (Barras) */}
          <ChartCard title="Distribuição Espacial (Por Região)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.spatialData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="regiao" type="category" width={100} />
                <Tooltip />
                <Bar
                  dataKey="ocorrencias"
                  fill="#00C49F"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Histograma de Idades */}
          <ChartCard title="Perfil das Vítimas (Distribuição Etária)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.histogramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faixa" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#FF8042" name="Vítimas" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* --- LINHA 3: Análise Preditiva e Comparação --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Feature Importance (XGBoost) */}
          <ChartCard title="Fatores de Risco (IA - XGBoost)">
            <p className="text-sm text-gray-500 mb-2">
              Quais variáveis mais influenciam a gravidade?
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="feature" type="category" width={80} />
                <Tooltip />
                <Bar
                  dataKey="importancia"
                  fill="#1650A7"
                  name="Importância (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Boxplot (Média de Tempo de Resposta) */}
          <ChartCard title="Tempo Médio de Resposta (min)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.boxplotData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="tipo"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tempo_medio" fill="#FF4444" name="Tempo (min)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  );
};

// Componentes Auxiliares
const KpiCard = ({ label, value, color = "text-[#1650A7]" }: any) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const ChartCard = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-[#1650A7] font-bold mb-4 flex items-center gap-2">
      <BarChart3 size={18} /> {title}
    </h3>
    {children}
  </div>
);

export default Dashboard;
